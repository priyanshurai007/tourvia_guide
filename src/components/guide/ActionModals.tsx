'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';

interface ActionModalsProps {
  selectedTour?: any;
  selectedBooking?: any;
  selectedMessage?: any;
}

export default function ActionModals({
  selectedTour,
  selectedBooking,
  selectedMessage,
}: ActionModalsProps) {
  // Tour modals
  const tourStatusModal = useModal();
  const tourDeleteModal = useModal();
  const tourEditModal = useModal();

  // Booking modals
  const bookingStatusModal = useModal();
  const bookingCancelModal = useModal();
  const bookingCompleteModal = useModal();

  // Message modals
  const messageDeleteModal = useModal();

  return (
    <>
      {/* Tour Modals */}
      <Modal
        isOpen={tourStatusModal.isOpen}
        onClose={tourStatusModal.closeModal}
        title="Update Tour Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to {selectedTour?.isActive ? 'deactivate' : 'activate'} this tour?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={tourStatusModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle status update
                tourStatusModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={tourDeleteModal.isOpen}
        onClose={tourDeleteModal.closeModal}
        title="Delete Tour"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this tour? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={tourDeleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle deletion
                tourDeleteModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Booking Modals */}
      <Modal
        isOpen={bookingStatusModal.isOpen}
        onClose={bookingStatusModal.closeModal}
        title="Update Booking Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to update the status of this booking?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={bookingStatusModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle status update
                bookingStatusModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={bookingCancelModal.isOpen}
        onClose={bookingCancelModal.closeModal}
        title="Cancel Booking"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to cancel this booking? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={bookingCancelModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle cancellation
                bookingCancelModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Confirm Cancellation
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={bookingCompleteModal.isOpen}
        onClose={bookingCompleteModal.closeModal}
        title="Complete Booking"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to mark this booking as completed?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={bookingCompleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle completion
                bookingCompleteModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      </Modal>

      {/* Message Modals */}
      <Modal
        isOpen={messageDeleteModal.isOpen}
        onClose={messageDeleteModal.closeModal}
        title="Delete Message"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this message? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={messageDeleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle deletion
                messageDeleteModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
} 