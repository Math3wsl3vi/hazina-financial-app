"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, query, where, onSnapshot } from "firebase/firestore";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Interface for appointment data in Firestore
interface Appointment {
  id: string;
  advisorId: string;
  advisorName: string;
  advisorType: 'business' | 'personal';
  createdAt: string;
  date: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  time: string;
  uid: string;
  userEmail?: string; // Added to store user email
  userName?: string; // Added to store user name
}

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

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);

  const router = useRouter();

  // Fetch scheduled appointments from Firestore
  useEffect(() => {
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('status', '==', 'scheduled')
    );

    const unsubscribe = onSnapshot(appointmentsQuery, (snapshot) => {
      const appointmentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Appointment[];
      setAppointments(appointmentData);
    }, (error) => {
      console.error('Error fetching scheduled appointments:', error);
      setActionError('Failed to load scheduled appointments. Please try again.');
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
    <div className="max-w-4xl mx-auto p-6 font-poppins">
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

      {/* Scheduled Appointments Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Scheduled Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">No scheduled appointments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advisor</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{appointment.advisorName}</TableCell>
                    <TableCell>{appointment.userName || 'N/A'}</TableCell>
                    <TableCell>{appointment.userEmail || 'N/A'}</TableCell>
                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{appointment.notes || 'N/A'}</TableCell>
                    <TableCell>
                      <span
                        className={
                          appointment.status === 'scheduled'
                            ? 'text-green-600'
                            : appointment.status === 'cancelled'
                            ? 'text-red-600'
                            : 'text-blue-600'
                        }
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Error Message */}
      {actionError && (
        <div className="mt-4 text-red-500 text-sm">{actionError}</div>
      )}
    </div>
  );
}