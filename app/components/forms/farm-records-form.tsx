"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Calendar, Clock, Save, Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { getFarmRecords, createFarmRecord, updateFarmRecord, deleteFarmRecord, FarmRecordOutput } from "../../actions/farm-records";
import { supabase } from "../../lib/supabase-client";

const animalTypes = [
  "Pig",
  "Poultry", 
  "Fisheries",
  "Other"
];

const vaccinationOptions = [
  "Newcastle Disease",
  "Avian Influenza",
  "Swine Fever",
  "Foot and Mouth Disease",
  "Brucellosis",
  "Anthrax",
  "Other"
];

export function FarmRecordsForm() {
  const [records, setRecords] = useState<FarmRecordOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FarmRecordOutput | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    animalType: "",
    quantity: 0,
    fodder: 0,
    deaths: 0,
    symptoms: "",
    vaccinations: "",
    date: new Date().toISOString().split('T')[0], // Default to today
  });

  const { toast } = useToast();

  // Get user ID on component mount (optional - works without login)
  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
          loadRecords(user.id);
        } else {
          // No user logged in - load guest records
          setUserId(null);
          loadRecords(null);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        // Even if there's an error, try to load guest records
        setUserId(null);
        loadRecords(null);
      }
    }
    getUser();
  }, []);

  const loadRecords = async (userId: string | null) => {
    try {
      setLoading(true);
      const data = await getFarmRecords(userId || undefined);
      setRecords(data);
    } catch (error) {
      console.error('Error loading records:', error);
      toast({
        title: "Error",
        description: "Failed to load farm records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'fodder' || name === 'deaths' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      if (editingRecord) {
        // Update existing record (userId is optional - will use guest user if not provided)
        const updatedRecord = await updateFarmRecord(editingRecord.id, formData, userId || undefined);
        setRecords(prev => prev.map(record => 
          record.id === editingRecord.id ? updatedRecord : record
        ));
        toast({
          title: "Record Updated",
          description: "Farm record has been updated successfully.",
        });
      } else {
        // Add new record (userId is optional - will use guest user if not provided)
        const newRecord = await createFarmRecord({
          ...formData,
          userId: userId || undefined,
        });
        setRecords(prev => [newRecord, ...prev]);
        toast({
          title: "Record Added",
          description: "New farm record has been added successfully.",
        });
      }

      resetForm();
    } catch (error: any) {
      console.error('Error saving record:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save farm record. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      animalType: "",
      quantity: 0,
      fodder: 0,
      deaths: 0,
      symptoms: "",
      vaccinations: "",
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
    setEditingRecord(null);
  };

  const handleEdit = (record: FarmRecordOutput) => {
    setEditingRecord(record);
    setFormData({
      animalType: record.animalType,
      quantity: record.quantity,
      fodder: record.fodder,
      deaths: record.deaths,
      symptoms: record.symptoms,
      vaccinations: record.vaccinations,
      date: new Date(record.date).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // userId is optional - will use guest user if not provided
      await deleteFarmRecord(id, userId || undefined);
      setRecords(prev => prev.filter(record => record.id !== id));
      toast({
        title: "Record Deleted",
        description: "Farm record has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting record:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete farm record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAnimalTypeColor = (animalType: string) => {
    switch (animalType) {
      case "Poultry":
        return "bg-blue-100 text-blue-800";
      case "Pig":
        return "bg-pink-100 text-pink-800";
      case "Fisheries":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading farm records...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Farm Activity Records</CardTitle>
                <CardDescription>
                  Track and manage your farm activities and compliance records
                </CardDescription>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {editingRecord ? "Edit Record" : "Add New Record"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="animalType">Animal Type</Label>
                    <select
                      id="animalType"
                      name="animalType"
                      value={formData.animalType}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    >
                      <option value="">Select animal type</option>
                      {animalTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder="Number of animals..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fodder">Fodder Consumed (kg)</Label>
                    <Input
                      id="fodder"
                      name="fodder"
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.fodder}
                      onChange={handleInputChange}
                      placeholder="Amount of fodder consumed..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deaths">Deaths</Label>
                    <Input
                      id="deaths"
                      name="deaths"
                      type="number"
                      min="0"
                      value={formData.deaths}
                      onChange={handleInputChange}
                      placeholder="Number of deaths..."
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms / Observations</Label>
                  <Textarea
                    id="symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    placeholder="Describe any symptoms or observations..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vaccinations">Vaccinations / Treatments</Label>
                  <select
                    id="vaccinations"
                    name="vaccinations"
                    value={formData.vaccinations}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select vaccination/treatment</option>
                    {vaccinationOptions.map(vaccination => (
                      <option key={vaccination} value={vaccination}>{vaccination}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {editingRecord ? "Update Record" : "Save Record"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Records List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-4"
      >
        {records.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{record.animalType}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAnimalTypeColor(record.animalType)}`}>
                        {record.animalType}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{record.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Fodder:</span>
                        <span className="font-medium">{record.fodder}kg</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Deaths:</span>
                        <span className={`font-medium ${record.deaths > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {record.deaths}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Symptoms:</span>
                        <span className="ml-2">{record.symptoms}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vaccinations:</span>
                        <span className="ml-2">{record.vaccinations}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(record)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(record.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}


