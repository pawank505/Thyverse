import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Pill as Pills,
  Ruler,
  Heart,
  FlaskRound as Flask,
} from "lucide-react";
import axios from "axios";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ThyroidLineChart from "./ThyroidLineChart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthProvider";

const COLORS = ["#FF9F43", "#1B2B65", "#FF7A00", "#324185"];

const thyroidData = [
  { name: "TSH", value: 2.5, range: "0.4-4.0" },
  { name: "T4", value: 1.2, range: "0.8-1.8" },
  { name: "T3", value: 3.1, range: "2.3-4.2" },
];

function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  // State variables for data fetched from the API
  const [vitals, setVitals] = useState([]);
  const [medications, setMedications] = useState([]);
  const [bodyMeasures, setBodyMeasures] = useState({});
  const [diastolic, setDiastolic] = useState([]);
  const [sistolic, setSistolic] = useState([]);
  const [pulserate, setPulserate] = useState([]);
  console.log(531654145, bodyMeasures)
  // Fetch data when currentUser is available
  useEffect(() => {
    if (!currentUser) return;
    getBodyMeasures(currentUser);
    getVitals(currentUser);
    fetchMediForGraph(currentUser);
  }, [currentUser]);
  const chartData = medications.map((med) => ({
    name: med.medication_name,
    value: med.medication_dosage,
  }));

  // Fetch Body Measurements and update state
  async function getBodyMeasures(currentUser) {
    try {
      const response = await axios.get(
        `http://localhost:4000/server/dashuser/get-body-measures/${currentUser._id}`
      );
      if (response.data.success) {
        const data = response.data;
        console.log("211111", data);
        setBodyMeasures({
          height: data.height,
          weight: data.weight?.at(-1).value || 0, // Get last element or default to 0
          bodyFat: data.bodyFat?.at(-1) || 0, // Handle undefined cases
          bmi: data.bmi?.at(-1).value || 0,
        });
        // Optionally update BMI category or calculate BMR here
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch medication data for the graph and update state
  async function fetchMediForGraph(currentUser) {
    try {
      const response = await axios.get(
        `http://localhost:4000/server/dashuser/get-medi-graph/${currentUser._id}`
      );
      const data = response.data;
      setMedications(data.medications);
      // Assuming API returns an object like { names: [...], dosages: [...] }
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch vitals data and update state
  async function getVitals(currentUser) {
    try {
      const response = await axios.get(
        `http://localhost:4000/server/dashuser/get-vitals/${currentUser._id}`
      );
      if (response.data.success) {
        // Assuming the API returns a vitals array like:
        // [{ name: "Mon", bp: 120, pulse: 72 }, ...]
        console.log(response.data.diastolic);
        setPulserate(response.data.pulse);
        setSistolic(response.data.systolic);
        setDiastolic(response.data.diastolic);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Transform the fetched body measures into an array for the BarChart
  const displayedBodyMeasures =
    Object.keys(bodyMeasures).length > 0
      ? [
          { name: "Weight", value: bodyMeasures.weight },
          { name: "Height", value: bodyMeasures.height },
          { name: "BMI", value: bodyMeasures.bmi },
          { name: "Body Fat %", value: bodyMeasures.bodyFat },
        ]
      : [];

  const displayedVitals = [
    {
      time: sistolic[0]?.date,
      systolic: sistolic[0]?.value,
      diastolic: diastolic[0]?.value,
      pulse: pulserate[0]?.value,
    },
    {
      time: sistolic[1]?.date,
      systolic: sistolic[1]?.value,
      diastolic: diastolic[1]?.value,
      pulse: pulserate[1]?.value,
    },
    {
      time: sistolic[2]?.date,
      systolic: sistolic[2]?.value,
      diastolic: diastolic[2]?.value,
      pulse: pulserate[2]?.value,
    },
    {
      time: sistolic[3]?.date,
      systolic: sistolic[3]?.value,
      diastolic: diastolic[3]?.value,
      pulse: pulserate[3]?.value,
    },
    {
      time: sistolic[4]?.date,
      systolic: sistolic[4]?.value,
      diastolic: diastolic[4]?.value,
      pulse: pulserate[4]?.value,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1B2B65] text-white p-6 flex justify-between items-center">
        <div className="max-w-7xl">
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-orange-300">John Doe - ID: 12345</p>
        </div>
        <div className="flex items-center gap-x-4 text-xl font-bold font-poppins">
          <p
            onClick={() => navigate("/thyverse/dashboard/bodyinput")}
            className="cursor-pointer"
          >
            My BodyMeasurements
          </p>
          <p
            onClick={() => navigate("/thyverse/dashboard/vitalinput")}
            className="cursor-pointer"
          >
            My Vitals
          </p>
          <p
            onClick={() => navigate("/thyverse/dashboard/medication")}
            className="cursor-pointer"
          >
            My Medications
          </p>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vitals Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart className="text-[#FF9F43]" />
            <h2 className="text-xl font-semibold text-[#1B2B65]">Vitals</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayedVitals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "#D1D5DB" }}
                tickMargin={10}
                stroke="#6B7280"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#D1D5DB" }}
                tickMargin={10}
                stroke="#6B7280"
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="systolic"
                name="Systolic"
                stroke="#F97316"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#F97316" }}
                activeDot={{ r: 7, fill: "#FDBA74" }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="Diastolic"
                stroke="#FB923C"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#FB923C" }}
                activeDot={{ r: 7, fill: "#FED7AA" }}
              />
              <Line
                type="monotone"
                dataKey="pulse"
                name="PulseRate"
                stroke="#FB923C"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#FB923C" }}
                activeDot={{ r: 7, fill: "#FED7AA" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Medications Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Pills className="text-[#FF9F43]" />
            <h2 className="text-xl font-semibold text-[#1B2B65]">
              Medications
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData} // Use transformed data
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Body Measurements Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <Ruler className="text-[#FF9F43]" />
            <h2 className="text-xl font-semibold text-[#1B2B65]">
              Body Measurements
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={displayedBodyMeasures}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF9F43" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Thyroid Panel Card (static data) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <ThyroidLineChart thyroidData={thyroidData} />
        </motion.div>
      </main>
    </div>
  );
}

export default Dashboard;
