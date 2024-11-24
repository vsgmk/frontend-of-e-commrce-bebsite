import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Delivery() {
  const { productId } = useParams();  // Get the productId from the URL
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/delivery/${productId}`); // Adjust endpoint to match your backend
        setDeliveryInfo(response.data);
      } catch (error) {
        console.error('Error fetching delivery information:', error);
      }
    };

    fetchDeliveryInfo();
  }, [productId]);

  if (!deliveryInfo) {
    return <div>Loading delivery details...</div>;
  }

  return (
    <div>
      <h1>Delivery Information</h1>
      <p>Product: {deliveryInfo.productName}</p>
      <p>Estimated Delivery: {deliveryInfo.estimatedDelivery}</p>
      {/* Render more details as needed */}
    </div>
  );
}

export default Delivery;
