"use client";

import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQuestion,
} from "react-icons/fa";
import Button from "@components/atoms/Button";
import Title from "@components/atoms/Title";
import Text from "@components/atoms/Text";

export type ConfirmationType = "confirm" | "success" | "error" | "warning";

interface ConfirmationModalProps {
  isOpen: boolean;
  type?: ConfirmationType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isDangerous?: boolean; // Red button for dangerous actions
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  type = "confirm",
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  isDangerous = false,
  isLoading = false,
}: ConfirmationModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error in confirmation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center">
            <FaCheckCircle className="w-10 h-10" />
          </div>
        );
      case "error":
        return (
          <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center">
            <FaTimes className="w-10 h-10" />
          </div>
        );
      case "warning":
        return (
          <div className="w-20 h-20 bg-warning/10 text-warning rounded-full flex items-center justify-center">
            <FaExclamationTriangle className="w-10 h-10" />
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 bg-info/10 text-info rounded-full flex items-center justify-center">
            <FaQuestion className="w-10 h-10" />
          </div>
        );
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case "success":
        return "bg-success text-white";
      case "error":
        return "bg-error text-white";
      case "warning":
        return "bg-warning text-white";
      default:
        return "bg-white text-primary";
    }
  };

  const getButtonColor = () => {
    if (isDangerous) return "btn-error";
    switch (type) {
      case "success":
        return "btn-success";
      case "error":
        return "btn-error";
      case "warning":
        return "btn-warning";
      default:
        return "btn-primary";
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "bg-black/60 backdrop-blur-sm" : "bg-black/0"
      }`}
      onClick={onCancel}
    >
      <div
        className={`bg-base-100 rounded-xl shadow-2xl w-full max-w-md transition-all duration-300 ${
          isVisible
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`${getHeaderColor()} px-6 py-4 rounded-t-xl flex items-center justify-between border-b border-base-300 sticky top-0 z-10`}
        >
          <Title variant="h4" className="font-bold">
            {title}
          </Title>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="text-current/60 hover:text-current hover:bg-current/10 rounded-full p-2 transition-all duration-200 hover:rotate-90 disabled:opacity-50"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col items-center text-center space-y-4">
            {getIcon()}
            <Text>{message}</Text>
          </div>

          {/* Footer */}
          <div className="flex gap-4 pt-6 border-t border-base-300">
            <Button
              type="button"
              onClick={onCancel}
              variant="ghost"
              className="flex-1 bg-white border-2 border-base-300 text-primary hover:bg-base-100 hover:border-base-400"
              disabled={isProcessing}
            >
              {cancelText}
            </Button>
            <Button
              type="button"
              onClick={handleConfirm}
              variant="primary"
              className={`flex-1 text-white ${getButtonColor()}`}
              disabled={isProcessing || isLoading}
            >
              {isProcessing ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                confirmText
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
