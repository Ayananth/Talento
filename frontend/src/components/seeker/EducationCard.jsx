import React, { useState, useEffect } from "react";
import EducationModal from "./EducationModal";
import DeleteModal from "./DeleteModalEdu";
import api from "../../apis/api";
import { Trash2 } from "lucide-react";


export default function EducationCard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [educationList, setEducationList] = useState([]);

  const loadEducation = async () => {
    const res = await api.get("v1/profile/me/education/");
    setEducationList(res.data);
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const openAddModal = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const openDeleteModal = (item) => {
    setDeleteItem(item);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editItem) {
      await api.patch(`v1/profile/me/education/${editItem.id}/`, data);
    } else {
      await api.post(`v1/profile/me/education/`, data);
    }
    setModalOpen(false);
    loadEducation();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    await api.delete(`v1/profile/me/education/${deleteItem.id}/`);
    setDeleteModalOpen(false);
    setDeleteItem(null);
    loadEducation();
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).getFullYear();
  };

  return (
    <>
      {/* Add/Edit Modal */}
      <EducationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editItem}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title={deleteItem?.degree}
      />

      {/* Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Education</h2>

          <button
            onClick={openAddModal}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            Add education
          </button>
        </div>

        {/* List Items */}
        <div className="space-y-6">
          {educationList.map((item) => (
            <div
              key={item.id}
              className="border-b last:border-none pb-6 last:pb-0"
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{item.degree}</h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 text-sm font-medium hover:underline"
                  >
                    Edit
                  </button>

                  {/* Delete icon */}
                  <button
                    onClick={() => openDeleteModal(item)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700">{item.institution}</p>

              <p className="text-sm text-gray-500 mt-1">
                {formatDate(item.start_date)} –{" "}
                {item.end_date ? formatDate(item.end_date) : "Present"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
