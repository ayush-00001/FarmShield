import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Shield, Menu, X } from 'lucide-react';

interface HeaderProps {
    onNavigate: (page: 'home' | 'dashboard' | 'assessment' | 'records' | 'alerts') => void;
    currentPage: string;
}

export const Header = ({ onNavigate, currentPage }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'assessment', label: 'Risk Assessment' },
        { id: 'records', label: 'Farm Records' },
        { id: 'alerts', label: 'Alerts' }
    ];

    return (
        <motion.header
            className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => onNavigate('home')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="bg-primary/10 rounded-full p-2">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold">FarmShield</span>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-1">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Button
                                    variant={currentPage === item.id ? "secondary" : "ghost"}
                                    onClick={() => onNavigate(item.id as any)}
                                    className="relative overflow-hidden"
                                >
                                    <motion.span
                                        whileHover={{ y: -2 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                </Button>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <motion.div
                            animate={{ rotate: isMenuOpen ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </motion.div>
                    </Button>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden pb-4 border-t mt-4 pt-4"
                        >
                            {navItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="block"
                                >
                                    <Button
                                        variant={currentPage === item.id ? "secondary" : "ghost"}
                                        onClick={() => {
                                            onNavigate(item.id as any);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full justify-start"
                                    >
                                        {item.label}
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};