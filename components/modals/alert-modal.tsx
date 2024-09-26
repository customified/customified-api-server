"use client"

import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/button";

interface AlertModelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
const AlertModal: React.FC<AlertModelProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading
}) => {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }


  return (
    <Modal
      title="Are you Sure?"
      description="This action is irreversible."
      isOpen={isOpen}
      onClose={onClose}>
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          variant="outline"
          onClick={onClose}
        >Cancel</Button>

        <Button
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
        >Continue</Button>
      </div>
    </Modal>
  )
}

export default AlertModal