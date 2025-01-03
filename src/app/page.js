"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import anime from "animejs";

export default function Home() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [bookingSummary, setBookingSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    anime({
      targets: ".main-heading",
      translateX: [-50, 0], // Animate from -50px to 0px
      opacity: [0, 1], // Fade in from 0 to 1 opacity
      easing: "easeOutExpo", // Smooth easing
      duration: 1000, // Animation duration in milliseconds
      delay: 500, // Delay before animation starts
    });
    anime({
      targets: ".form-div",
      translateY: [-50, 0], // Animate from -50px to 0px
      opacity: [0, 1], // Fade in from 0 to 1 opacity
      easing: "easeOutExpo", // Smooth easing
      duration: 1500, // Animation duration in milliseconds
      delay: 500, // Delay before animation starts
    });
    anime({
      targets: ".form-element",
      translateY: [50, 0], // Animate from -50px to 0px
      opacity: [0, 1], // Fade in from 0 to 1 opacity
      easing: "easeOutExpo", // Smooth easing
      duration: 2000, // Animation duration in milliseconds
      delay: 500, // Delay before animation starts
    });
  }, [errorMessage]);

  const validateForm = () => {
    if (!date) return "Please select a valid date.";
    if (!time) return "Please select a valid time.";
    if (guests < 1) return "Number of guests must be at least 1.";
    if (!name.trim()) return "Name cannot be empty.";
    if (!/^[0-9]{10}$/.test(contact))
      return "Please enter a valid 10-digit contact number.";
    return null;
  };

  const checkAvailability = async () => {
    if (date && time) {
      try {
        const res = await axios.get(
          `https://table-backend.vercel.app/api/availability?date=${date}&time=${time}`
        );
        setAvailabilityMessage(res.data.message || (res.data.slots.length > 0 ? 'Slot is available!' : 'Slot is already booked.'));
      } catch (err) {
        console.error(err);
        setAvailabilityMessage("Error checking availability.");
      }
    } else {
      setAvailabilityMessage("Please select a date and time.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      setErrorMessage(error);
      return;
    }

    const booking = { date, time, guests, name, contact };
    try {
      const res = await axios.post(
        "https://table-backend.vercel.app/api/bookings",
        booking
      );
      if(res.data.message){
        setAvailabilityMessage("slot is already booked")
        return
      }
      setBookingSummary(res.data);
      setErrorMessage("");
      setAvailabilityMessage(null);
    } catch (err) {
      console.error(err);
      setErrorMessage("Error submitting booking. Please try again.");
    }
  };

  const handleCancel = async () => {
    if (bookingSummary) {
      try {
        await axios.delete("https://table-backend.vercel.app/api/bookings", {
          data: { date: bookingSummary.date, time: bookingSummary.time },
        });
        setBookingSummary(null);
        setDate("")
        setTime("")
        setName("")
        setContact("")
        setGuests("")
        setAvailabilityMessage("Booking is cancelled")
        setTimeout(()=>{
          setAvailabilityMessage("")
        },5000)
        
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 p-4"
      style={{ fontFamily: "'Montserrat', serif" }}
    >
      <h1 className="text-2xl font-bold text-center m-9 main-heading">
        Restaurant Table Booking
      </h1>
      <form
        className="max-w-md mx-auto bg-white shadow-md rounded p-6 space-y-4 form-div"
        onSubmit={handleSubmit}
      >
        <label className="block form-element">
          <span className="text-gray-700 form-element">Date:</span>
          <input
            type="date"
            className="block p-2 w-full mt-1 border rounded form-element"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>

        <label className="block form-element">
          <span className="text-gray-700">Time:</span>
          <input
            type="time"
            className="block p-2 w-full mt-1 border rounded form-element"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </label>

        <label className="block form-element">
          <span className="text-gray-700">Number of Guests:</span>
          <input
            type="number"
            min="1"
            className="block p-2 w-full mt-1 border rounded form-element"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            required
          />
        </label>

        <label className="block form-element">
          <span className="text-gray-700">Name:</span>
          <input
            type="text"
            className="block p-2 w-full mt-1 border rounded form-element"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block form-element">
          <span className="text-gray-700">Contact Details:</span>
          <input
            type="text"
            className="block p-2 w-full mt-1 border rounded form-element"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </label>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={checkAvailability}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 form-element"
          >
            Check Availability
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 form-element"
          >
            Book Table
          </button>
        </div>

        {errorMessage && (
          <p className="mt-2 text-center text-red-600">{errorMessage}</p>
        )}
        {availabilityMessage && (
          <p className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400">
            {availabilityMessage}
          </p>
        )}
      </form>

      {bookingSummary && (
        <div className="max-w-md mx-auto mt-6 p-4 bg-green-100 rounded">
          <h2 className="text-lg font-bold">Booking Confirmed!</h2>
          <p>Date: {bookingSummary.date}</p>
          <p>Time: {bookingSummary.time}</p>
          <p>Guests: {bookingSummary.guests}</p>
          <p>Name: {bookingSummary.name}</p>
          <p>Contact: {bookingSummary.contact}</p>
          <button
            onClick={handleCancel}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}
