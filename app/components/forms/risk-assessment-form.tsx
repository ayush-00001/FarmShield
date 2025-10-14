"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radiogroup";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { CheckCircle, AlertTriangle, Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/use-toast";

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
  category: string;
}

const questions: Question[] = [
  {
    id: "biosecurity_measures",
    question: "How would you rate your current biosecurity measures?",
    options: [
      { value: "excellent", label: "Excellent - Comprehensive protocols in place", score: 0 },
      { value: "good", label: "Good - Most protocols followed", score: 2 },
      { value: "fair", label: "Fair - Some protocols in place", score: 5 },
      { value: "poor", label: "Poor - Limited biosecurity measures", score: 8 },
    ],
    category: "Biosecurity"
  },
  {
    id: "cleaning_frequency",
    question: "How often do you clean and disinfect your facilities?",
    options: [
      { value: "daily", label: "Daily", score: 0 },
      { value: "weekly", label: "Weekly", score: 2 },
      { value: "monthly", label: "Monthly", score: 5 },
      { value: "rarely", label: "Rarely or never", score: 8 },
    ],
    category: "Hygiene"
  },
  {
    id: "visitor_control",
    question: "How do you control visitor access to your farm?",
    options: [
      { value: "strict", label: "Strict protocols with disinfection", score: 0 },
      { value: "moderate", label: "Moderate control with some protocols", score: 3 },
      { value: "limited", label: "Limited control", score: 6 },
      { value: "none", label: "No visitor control", score: 10 },
    ],
    category: "Access Control"
  },
  {
    id: "vaccination_program",
    question: "What is your vaccination program status?",
    options: [
      { value: "comprehensive", label: "Comprehensive program with all recommended vaccines", score: 0 },
      { value: "basic", label: "Basic program with essential vaccines", score: 3 },
      { value: "minimal", label: "Minimal vaccination", score: 6 },
      { value: "none", label: "No vaccination program", score: 10 },
    ],
    category: "Health Management"
  },
  {
    id: "feed_quality",
    question: "How do you ensure feed quality and safety?",
    options: [
      { value: "certified", label: "Certified suppliers with quality testing", score: 0 },
      { value: "reliable", label: "Reliable suppliers with basic checks", score: 2 },
      { value: "basic", label: "Basic quality checks", score: 5 },
      { value: "none", label: "No quality control measures", score: 8 },
    ],
    category: "Feed Management"
  },
  {
    id: "waste_management",
    question: "How do you handle farm waste and manure?",
    options: [
      { value: "proper", label: "Proper treatment and disposal", score: 0 },
      { value: "adequate", label: "Adequate disposal methods", score: 3 },
      { value: "basic", label: "Basic disposal", score: 6 },
      { value: "poor", label: "Poor or no waste management", score: 10 },
    ],
    category: "Waste Management"
  },
  {
    id: "disease_monitoring",
    question: "How do you monitor for diseases in your livestock?",
    options: [
      { value: "regular", label: "Regular veterinary checks and monitoring", score: 0 },
      { value: "occasional", label: "Occasional veterinary visits", score: 4 },
      { value: "minimal", label: "Minimal monitoring", score: 7 },
      { value: "none", label: "No disease monitoring", score: 10 },
    ],
    category: "Health Monitoring"
  },
  {
    id: "equipment_maintenance",
    question: "How often do you maintain and clean equipment?",
    options: [
      { value: "regular", label: "Regular maintenance and cleaning", score: 0 },
      { value: "periodic", label: "Periodic maintenance", score: 3 },
      { value: "occasional", label: "Occasional maintenance", score: 6 },
      { value: "rarely", label: "Rarely or never", score: 9 },
    ],
    category: "Equipment"
  }
];

export function RiskAssessmentForm() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRiskScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateRiskScore = () => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(question => {
      const answer = answers[question.id];
      const selectedOption = question.options.find(opt => opt.value === answer);
      if (selectedOption) {
        totalScore += selectedOption.score;
      }
      maxScore += Math.max(...question.options.map(opt => opt.score));
    });

    const riskPercentage = (totalScore / maxScore) * 100;
    let riskLevel = "Low";
    let riskColor = "text-green-600";
    let riskBgColor = "bg-green-100";

    if (riskPercentage > 70) {
      riskLevel = "High";
      riskColor = "text-red-600";
      riskBgColor = "bg-red-100";
    } else if (riskPercentage > 40) {
      riskLevel = "Medium";
      riskColor = "text-yellow-600";
      riskBgColor = "bg-yellow-100";
    }

    setIsCompleted(true);
    
    toast({
      title: "Assessment Complete!",
      description: `Your farm's risk level is ${riskLevel}. Score: ${Math.round(riskPercentage)}%`,
    });
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
  };

  if (isCompleted) {
    const totalScore = Object.values(answers).reduce((acc, answer) => {
      const question = questions.find(q => q.id === Object.keys(answers).find(key => answers[key] === answer));
      const option = question?.options.find(opt => opt.value === answer);
      return acc + (option?.score || 0);
    }, 0);

    const maxScore = questions.reduce((acc, question) => {
      return acc + Math.max(...question.options.map(opt => opt.score));
    }, 0);

    const riskPercentage = (totalScore / maxScore) * 100;
    let riskLevel = "Low";
    let riskColor = "text-green-600";
    let riskBgColor = "bg-green-100";
    let recommendations = [
      "Continue maintaining excellent biosecurity practices",
      "Keep up with regular veterinary checkups",
      "Maintain your current vaccination schedule"
    ];

    if (riskPercentage > 70) {
      riskLevel = "High";
      riskColor = "text-red-600";
      riskBgColor = "bg-red-100";
      recommendations = [
        "Implement comprehensive biosecurity protocols immediately",
        "Increase cleaning and disinfection frequency",
        "Establish strict visitor control measures",
        "Develop a vaccination program with your veterinarian",
        "Improve waste management practices"
      ];
    } else if (riskPercentage > 40) {
      riskLevel = "Medium";
      riskColor = "text-yellow-600";
      riskBgColor = "bg-yellow-100";
      recommendations = [
        "Strengthen existing biosecurity measures",
        "Increase monitoring frequency",
        "Review and update vaccination protocols",
        "Improve equipment maintenance schedules"
      ];
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div className={`rounded-full p-4 w-20 h-20 mx-auto ${riskBgColor}`}>
                <Shield className={`h-12 w-12 mx-auto ${riskColor}`} />
              </div>
            </motion.div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              Your farm's biosecurity risk assessment results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${riskColor}`}>
                {riskLevel} Risk
              </div>
              <div className="text-lg text-muted-foreground">
                Score: {Math.round(riskPercentage)}%
              </div>
              <Progress value={riskPercentage} className="mt-4" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Recommendations:</h3>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <Button onClick={resetAssessment} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
              <Button className="flex-1">
                Save Results
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];
  const hasAnswer = answers[currentQ.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Biosecurity Risk Assessment</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </div>
          </div>
          <Progress value={progress} className="mb-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">{currentQ.category}</span>
            </div>
            <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          </div>

          <RadioGroup
            value={answers[currentQ.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQ.options.map((option) => (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!hasAnswer}
            >
              {currentQuestion === questions.length - 1 ? "Complete" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
