"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { db } from "@/configs/firebaseConfig";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddAdvisorPage() {
  const [formData, setFormData] = useState({
    name: "",
    specialization: [""],
    credentials: "",
    experience: 0,
    rating: 0,
    languages: [""],
    bio: "",
    imageUrl: "",
    type: "personal", // personal or business
  });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "advisors"), {
        ...formData,
        availability: generateDefaultAvailability(),
        createdAt: new Date().toISOString(),
      });

      toast.success("Advisor added successfully!");
      router.push("/home/home-personal");
    } catch (error) {
      toast.error("Error adding advisor");
      console.error(error);
    }
  };

  const generateDefaultAvailability = () => {
    const availability = [];
    const today = new Date();

    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      if (date.getDay() !== 0 && date.getDay() !== 6) {
        availability.push({
          date: date.toISOString().split("T")[0],
          slots: [
            { start: "09:00", end: "10:00", booked: false },
            { start: "10:00", end: "11:00", booked: false },
          ],
        });
      }
    }
    return availability;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 font-poppins">
      <h1 className="text-2xl font-bold mb-6 uppercase">Add New Advisor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Advisor Type */}
        <div>
          <Label>Advisor Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select advisor type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Other Fields */}
        <div>
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Qualifications</Label>
          <Input
            value={formData.specialization.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                specialization: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />
        </div>
        <div>
          <Label>Experience</Label>
          <Input
            type="number"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>Languages Spoken</Label>
          <Input
            value={formData.languages.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                languages: e.target.value.split(",").map((l) => l.trim()),
              })
            }
          />
        </div>
        <div>
          <Label>Rating</Label>
          <Input
            type="number"
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: Number(e.target.value) })
            }
          />
        </div>
        <div>
          <Label>More Information</Label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
        </div>

        <Button type="submit">Add Advisor</Button>
      </form>
    </div>
  );
}
