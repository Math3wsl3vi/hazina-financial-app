  import { useEffect, useState } from "react";
  import { collection, getDocs, query, where } from "firebase/firestore";
  import { db } from "@/configs/firebaseConfig";
  import { Advisor } from "@/lib/types";

  export function useAdvisors() {
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAdvisors = async () => {
        try {
          const q = query(
            collection(db, "advisors"), 
            where("type", "==", "personal") 
          );
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Advisor[];
          setAdvisors(data);
        } catch (error) {
          console.error("Error fetching advisors:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAdvisors();
    }, []);

    return { advisors, loading };
  }
