import React, { useState, useEffect, useRef } from 'react';
import supabase from '../../services/supabaseClient';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    triptype: '',
    description: '',
  });
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [streetViewService, setStreetViewService] = useState(null);
  const [streetViewPanorama, setStreetViewPanorama] = useState(null);
  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) return;

    const initializeAutocomplete = (inputRef) => {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        setFormData((prevData) => ({
          ...prevData,
          [inputRef.current.name]: place.name,
        }));
      });
    };

    const initializeMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
        mapTypeId: 'roadmap',
        streetViewControl: true,
        zoomControl: true,
        mapTypeControl: true,
        scaleControl: true,
        rotateControl: true,
      });
      setMap(map);

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);
      setDirectionsService(directionsService);
      setDirectionsRenderer(directionsRenderer);

      const streetViewService = new window.google.maps.StreetViewService();
      const streetViewPanorama = new window.google.maps.StreetViewPanorama(
        document.getElementById('street-view'),
        {
          position: { lat: -34.397, lng: 150.644 },
          pov: { heading: 165, pitch: 0 },
          zoom: 1,
        }
      );
      setStreetViewService(streetViewService);
      setStreetViewPanorama(streetViewPanorama);

      map.addListener('click', (e) => {
        const latLng = e.latLng;
        console.log(`Lat: ${latLng.lat()}, Lng: ${latLng.lng()}`);
      });
    };

    initializeAutocomplete(originRef);
    initializeAutocomplete(destinationRef);
    initializeMap();

    return () => {
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { origin, destination, date, time, triptype, description } = formData;

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error getting user:', userError);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error getting profile:', profileError);
      return;
    }

    const { data, error } = await supabase
      .from('trips')
      .insert([{ origin, destination, date, time, triptype, description, creator_id: profile.id }]);

    if (error) {
      console.error('Error creating trip:', error);
    } else {
      console.log('Trip created:', data);

      // Show route on map
      if (directionsService && directionsRenderer) {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error(`Error fetching directions: ${result}`);
            }
          }
        );
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input ref={originRef} name="origin" value={formData.origin} onChange={handleChange} placeholder="Origin" required />
        <input ref={destinationRef} name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} required />
        <input name="time" type="time" value={formData.time} onChange={handleChange} required />
        <select name="triptype" value={formData.triptype} onChange={handleChange} required>
          <option value="">Select Trip Type</option>
          <option value="classes">Classes</option>
          <option value="recreation">Recreation</option>
        </select>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
        <button type="submit">Create Trip</button>
      </form>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }}></div>
      <div id="street-view" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
};

export default CreatePost;
