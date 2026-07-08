import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "../ui/spinner";

const DeleteConfirmation = ({
    open,
    onOpenChange,
    onConfirm,
    onCancel,
    loading = false,
    title = "Delete Item",
    description = "Are you sure you want to delete this item? This action cannot be undone.",
}) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md overflow-hidden p-0 gap-0">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full"
                        >
                            {/* Header with gradient background */}
                            <div className="relative bg-linear-to-br from-red-50 via-rose-50 to-orange-50 px-6 pt-8 pb-6">
                                {/* Decorative blur circle */}
                                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-red-200/30 blur-3xl" />
                                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-200/20 blur-3xl" />

                                <div className="relative flex flex-col items-center text-center">
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.1
                                        }}
                                        className="relative"
                                    >
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
                                            <Trash2 className="h-10 w-10 text-white" />
                                        </div>
                                        {/* Pulsing ring */}
                                        <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                                    </motion.div>

                                    <AlertDialogTitle className="mt-6 text-2xl font-bold text-gray-900">
                                        {title}
                                    </AlertDialogTitle>

                                    <AlertDialogDescription className="mt-2 max-w-sm text-sm text-gray-600 leading-relaxed">
                                        {description}
                                    </AlertDialogDescription>
                                </div>
                            </div>

                            {/* Footer with actions */}
                            <div className="bg-white px-6 py-5">
                                <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-3">
                                    <AlertDialogCancel asChild>
                                        <Button
                                            variant="outline"
                                            disabled={loading}
                                            onClick={onCancel}
                                        >
                                            Cancel
                                        </Button>
                                    </AlertDialogCancel>

                                    <AlertDialogAction asChild>
                                        <Button
                                            disabled={loading}
                                            onClick={onConfirm}
                                            size=""
                                        >
                                            {
                                                loading ? (
                                                    <span className="flex gap-2">
                                                        <Spinner data-icon="inline-start" />
                                                        Deleting...
                                                    </span>
                                                ) : (
                                                    <span className="flex gap-2">
                                                        <Trash2 />
                                                        Delete
                                                    </span>
                                                )
                                            }
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>

                                <p className="mt-3 text-center text-xs text-gray-400">
                                    This action is permanent and cannot be reversed
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmation;
