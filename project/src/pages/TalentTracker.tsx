import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TalentTracker() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/masters');
  }, [navigate]);

  return null;
}
