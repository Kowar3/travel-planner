import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { calculateDays, toLatin } from "@/utils/helpers";
import api from "@/api/axios";
import type { AddressObject } from "@/types/types";

export const useCreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    budget: "",
    startCity: "",
    startLat: 0,
    startLng: 0,
    endCity: "",
    endLat: 0,
    endLng: 0,
  });

  const handleMapSelect = (
    addrObj: AddressObject,
    lat: number,
    lng: number,
    displayName?: string,
  ) => {
    let rawCity =
      addrObj.city ||
      addrObj.town ||
      addrObj.village ||
      addrObj.suburb ||
      (displayName ? displayName.split(",")[0] : "Unknown");

    let cleanName = toLatin(rawCity)
      .replace(
        /(Gradska opština|Opština|Grad|City of|Municipality of)\s+/gi,
        "",
      )
      .trim();

    if (selecting === "start") {
      setFormData((prev) => ({
        ...prev,
        startCity: cleanName,
        startLat: lat,
        startLng: lng,
      }));
      setSelecting("end");
      toast.info(`Departure: ${cleanName}`);
    } else {
      setFormData((prev) => ({
        ...prev,
        endCity: cleanName,
        endLat: lat,
        endLng: lng,
      }));
      toast.success(`Goal: ${cleanName}`);
    }
  };

  const handleCreateTrip = async () => {
    if (!formData.title) return toast.error("Fill in the title!");
    if (formData.startLat === 0) return toast.error("Choose start point!");
    if (formData.endLat === 0) return toast.error("Choose end point!");
    if (!formData.startDate) return toast.error("Select departure date!");
    if (!formData.endDate) return toast.error("Select return date!");

    const budgetNum = Number(formData.budget);
    if (!formData.budget || budgetNum <= 0) {
      return toast.error("Budget must be greater than 0 €!");
    }

    setLoading(true);
    try {
      const tripRes = await api.post("/trips", {
        ...formData,
        totalBudget: budgetNum,
      });

      const newTripId = tripRes.data._id;

      await api.post("/destinations", {
        tripId: newTripId,
        city: formData.endCity,
        country: "Final Destination",
        startDate: formData.endDate,
        endDate: formData.endDate,
        latitude: formData.endLat,
        longitude: formData.endLng,
        isFinal: true,
      });

      toast.success("Trip successfully created!");
      navigate(`/trips/${newTripId}`);
    } catch (err: any) {
      const errMsg = err.response?.data?.error || "Error while saving trip!";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    loading,
    selecting,
    setSelecting,
    handleMapSelect,
    handleCreateTrip,
    daysCount: calculateDays(formData.startDate, formData.endDate),
  };
};
