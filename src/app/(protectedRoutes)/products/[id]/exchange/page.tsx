"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Upload,
  CheckCircle,
  X,
  AlertCircle,
  DollarSign,
  Shield,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { mockProducts } from "@/app/data/mock-data";
import ChatModal from "@/components/chat-message";

// Payment method types
type PaymentMethod = "card" | "easypaisa" | "manual";

// Exchange form data
type ExchangeFormData = {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardholderName: string;
  easypaisaNumber: string;
  billSlip: File | null;
  termsAccepted: boolean;
};

// Product type
type Product = {
  id: string;
  title: string;
  images: { id: string; url: string; isPrimary: boolean }[];
  priceCents: number;
  condition: string;
  owner: {
    id: string;
    fullName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    rating: number;
  };
};

// Loading Skeleton
const ExchangeSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  </div>
);

// Terms and Conditions Modal
const TermsModal = ({
  isOpen,
  onClose,
  onAccept,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Terms and Conditions</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-96">
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
              <p>
                By proceeding with this exchange, you agree to the following
                terms and conditions:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    You confirm that you are the rightful owner of the item
                    being exchanged and have the authority to complete this
                    transaction.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    The item description and condition must be accurate. Any
                    misrepresentation may result in transaction cancellation.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Payment will be processed securely through our payment
                    partners. Your payment information is encrypted and secure.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Once payment is confirmed, you will be connected with the
                    seller to arrange the exchange details.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    SwapHub acts as an intermediary and is not responsible for
                    the quality or condition of exchanged items.
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    All disputes must be resolved between the parties involved.
                    SwapHub provides support but does not guarantee resolution.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-800 dark:text-yellow-200">
                    Please ensure you have read and understood all terms before
                    proceeding. By clicking "I Agree", you acknowledge that you
                    have read and agree to these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={onAccept} className="flex-1">
              I Agree to Terms
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Success Modal
const SuccessModal = ({
  isOpen,
  onClose,
  onOpenChat,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>

          <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Your payment has been processed successfully. You can now contact
            the seller to arrange the exchange.
          </p>

          <div className="space-y-3">
            <Button onClick={onOpenChat} className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Open Conversation
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ExchangePage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ExchangeFormData>({
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
    easypaisaNumber: "",
    billSlip: null,
    termsAccepted: false,
  });
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundProduct = mockProducts.find((p) => p.id === params.id);
      if (foundProduct) {
        setProduct({
          id: foundProduct.id,
          title: foundProduct.title,
          images: foundProduct.images.map((img: any) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.order === 0,
          })),
          priceCents: Math.round((foundProduct.estimatedValue || 0) * 100),
          condition: foundProduct.condition,
          owner: {
            id: foundProduct.ownerId,
            fullName: foundProduct.owner?.name || "Unknown User",
            profileImageUrl: foundProduct.owner?.profileImage,
            isVerified: foundProduct.owner?.isVerified || false,
            rating: 4.5,
          },
        });
      }
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const formatPrice = (priceCents: number) => {
    return `$${(priceCents / 100).toFixed(2)}`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, billSlip: file }));
    }
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handlePayNow = () => {
    if (!formData.termsAccepted) {
      setTermsModalOpen(true);
      return;
    }

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessModalOpen(true);
    }, 2000);
  };

  const handleTermsAccept = () => {
    setFormData((prev) => ({ ...prev, termsAccepted: true }));
    setTermsModalOpen(false);
    handlePayNow();
  };

  const handleOpenChat = () => {
    setSuccessModalOpen(false);
    setChatModalOpen(true);
  };

  if (loading) {
    return <ExchangeSkeleton />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#18181b] text-black dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Product
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Summary */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Exchange Summary</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your exchange for this item
              </p>
            </div>

            {/* Product Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <img
                    src={
                      product.images.find((img) => img.isPrimary)?.url ||
                      product.images[0]?.url
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.condition}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      by {product.owner.fullName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.priceCents)}
                    </span>
                    {product.owner.isVerified && (
                      <Shield className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bill Slip Upload */}
            <div className="space-y-3">
              <Label htmlFor="bill-slip" className="text-sm font-medium">
                Upload Bill Slip (Optional)
              </Label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  id="bill-slip"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="bill-slip" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.billSlip
                      ? formData.billSlip.name
                      : "Click to upload bill slip"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Choose your preferred payment method
              </p>
            </div>

            {/* Payment Method Selection */}
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handlePaymentMethodChange(value as PaymentMethod)
              }
              className="space-y-3"
            >
              <div className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="card" id="card" />
                <Label
                  htmlFor="card"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="h-5 w-5" />
                  Credit/Debit Card
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="easypaisa" id="easypaisa" />
                <Label
                  htmlFor="easypaisa"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Smartphone className="h-5 w-5" />
                  EasyPaisa
                </Label>
              </div>

              <div className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value="manual" id="manual" />
                <Label
                  htmlFor="manual"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <DollarSign className="h-5 w-5" />
                  Manual Payment
                </Label>
              </div>
            </RadioGroup>

            {/* Payment Form Fields */}
            {formData.paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardholder">Cardholder Name</Label>
                  <Input
                    id="cardholder"
                    placeholder="John Doe"
                    value={formData.cardholderName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cardholderName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="cardnumber">Card Number</Label>
                  <Input
                    id="cardnumber"
                    placeholder="1234 5678 9012 3456"
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cardNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={formData.cardExpiry}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cardExpiry: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cardCvv}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          cardCvv: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === "easypaisa" && (
              <div>
                <Label htmlFor="easypaisa-number">EasyPaisa Number</Label>
                <Input
                  id="easypaisa-number"
                  placeholder="03XX XXXXXXX"
                  value={formData.easypaisaNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      easypaisaNumber: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {formData.paymentMethod === "manual" && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-1">
                      Manual Payment Instructions
                    </p>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      You will receive payment instructions via email after
                      placing your order. Please complete the payment within 24
                      hours to confirm your exchange.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    termsAccepted: e.target.checked,
                  }))
                }
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  className="text-primary hover:underline"
                >
                  Terms and Conditions
                </button>
              </Label>
            </div>

            {/* Pay Now Button */}
            <Button
              onClick={handlePayNow}
              disabled={!formData.termsAccepted || isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
              size="lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                <>
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pay Now - {formatPrice(product.priceCents)}
                </>
              )}
            </Button>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        onAccept={handleTermsAccept}
      />

      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onOpenChat={handleOpenChat}
      />

      {/* Chat Modal */}
      <ChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        seller={{
          id: product.owner.id,
          name: product.owner.fullName,
          profileImage: product.owner.profileImageUrl,
          isVerified: product.owner.isVerified,
          rating: product.owner.rating,
          phoneNumber: "+1-555-123-4567",
          email: "seller@example.com",
          location: "New York, NY",
          lastSeen: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        }}
        productTitle={product.title}
        productImage={product.images[0]?.url}
      />
    </div>
  );
}
