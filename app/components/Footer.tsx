import { motion } from 'framer-motion';
import { Shield, Heart, Globe, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: ["Dashboard", "Risk Assessment", "Farm Records", "Alerts"]
        },
        {
            title: "Resources",
            links: ["Documentation", "Best Practices", "Case Studies", "Support"]
        },
        {
            title: "Company",
            links: ["About Us", "Contact", "Privacy Policy", "Terms of Service"]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <footer className="bg-muted/30 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
                >
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-primary/10 rounded-full p-2">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-xl font-bold">FarmShield</span>
                        </div>
                        <p className="text-muted-foreground max-w-md">
                            Protecting livestock through intelligent biosecurity management.
                            Trusted by thousands of farmers worldwide to maintain the highest
                            standards of farm safety and compliance.
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>contact@farmshield.com</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                <span>+1 (555) 123-FARM</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Agricultural Innovation Center</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Navigation Sections */}
                    {footerSections.map((section, sectionIndex) => (
                        <motion.div
                            key={section.title}
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <h3 className="font-semibold text-foreground">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li
                                        key={link}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <a
                                            href="#"
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="py-6 border-t flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
                >
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <span>© {currentYear} FarmShield. Made with</span>
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                        >
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </motion.div>
                        <span>for farmers worldwide</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <Globe className="h-4 w-4" />
                            <span>Global Coverage</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};