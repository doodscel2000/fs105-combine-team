import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js"; // Import Chart and registerables
import axios from "axios";
import { useAuth } from "../../contexts/authContext/authContext"; // Adjust path as necessary

// Register all necessary components
Chart.register(...registerables);

const Earnings = () => {
  const { currentUser } = useAuth();
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders/seller/${currentUser.uid}`);
        const orders = response.data;
        console.log('raw orders', orders);

        // Filter for completed orders and those from the last 6 months
        const filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.updatedAt);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return order.isCompleted && orderDate >= sixMonthsAgo; // Using isCompleted
        });

        console.log('filtered orders', filteredOrders);

        // Create an array for the last 6 months in ascending order
        const earnings = {};
        const months = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
          const monthYear = new Date(currentDate.getFullYear(), currentDate.getMonth() - i).toLocaleString('default', { year: 'numeric', month: 'long' });
          months.push(monthYear);
          earnings[monthYear] = 0; // Initialize each month with 0 earnings
        }

        // Calculate total earnings for filtered orders
        filteredOrders.forEach(order => {
          const orderDate = new Date(order.updatedAt);
          const monthYear = orderDate.toLocaleString('default', { year: 'numeric', month: 'long' }); // Get month and year

          // Calculate total earnings for this order
          const item = order.item; // Access the single item
          if (item) {
            const totalOrderEarnings = item.itemOrderPrice * item.itemQuantity; // Calculate earnings
            // Add to the earnings for the monthYear
            if (earnings[monthYear] !== undefined) {
              earnings[monthYear] += totalOrderEarnings;
            }
          } else {
            console.warn(`Order with ID ${order._id} does not have an item.`);
          }
        });

        // Prepare chart data using the complete list of months
        const data = months.map(monthYear => earnings[monthYear]);

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Earnings',
              data: data,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (err) {
        setError("Error fetching orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Earnings Over Last 6 Months</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Earnings ($)', // Set the y-axis label
              },
            },
            x: {
              title: {
                display: true,
                text: 'Months', // Set the x-axis label
              },
            },
          },
        }}
      />
    </div>
  );
};

export default Earnings;
