'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useModal } from '@/hooks/useModal';

interface ActionModalsProps {
  selectedGuide?: any;
  selectedDestination?: any;
  selectedBooking?: any;
  selectedUser?: any;
}

export default function ActionModals({
  selectedGuide,
  selectedDestination,
  selectedBooking,
  selectedUser,
}: ActionModalsProps) {
  // Guide modals
  const guideStatusModal = useModal();
  const guideDeleteModal = useModal();
  const guideEditModal = useModal();

  // Destination modals
  const destinationDeleteModal = useModal();
  const destinationEditModal = useModal();

  // Booking modals
  const bookingStatusModal = useModal();
  const bookingCancelModal = useModal();

  // User modals
  const userStatusModal = useModal();
  const userDeleteModal = useModal();

  return (
    <>
      {/* Guide Modals */}
      <Modal
        isOpen={guideStatusModal.isOpen}
        onClose={guideStatusModal.closeModal}
        title="Update Guide Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to {selectedGuide?.isActive ? 'deactivate' : 'activate'} this guide?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={guideStatusModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle status update
                guideStatusModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={guideDeleteModal.isOpen}
        onClose={guideDeleteModal.closeModal}
        title="Delete Guide"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this guide? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={guideDeleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle deletion
                guideDeleteModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* Destination Modals */}
      <Modal
        isOpen={destinationDeleteModal.isOpen}
        onClose={destinationDeleteModal.closeModal}
        title="Delete Destination"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this destination? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={destinationDeleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle deletion
                destinationDeleteModal.closeModal();
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

      {/* User Modals */}
      <Modal
        isOpen={userStatusModal.isOpen}
        onClose={userStatusModal.closeModal}
        title="Update User Status"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to {selectedUser?.isActive ? 'deactivate' : 'activate'} this user?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={userStatusModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle status update
                userStatusModal.closeModal();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={userDeleteModal.isOpen}
        onClose={userDeleteModal.closeModal}
        title="Delete User"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={userDeleteModal.closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle deletion
                userDeleteModal.closeModal();
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