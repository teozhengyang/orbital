import { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthContext';
import axios from "axios";
import { Button } from 'react-bootstrap';

export default function Profile() {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const [currUser, setCurrUser] = useState([])
  const [organisedEvents, setOrganisedEvents] = useState([])
  const [participatedEvents, setParticipatedEvents] = useState([])

  useEffect(() => {
    getCurrUser()
  },[])

  // Headers for authorization @ backend => Allows Get/Post request for event data
  const config = {
    headers:{
      'Authorization': 'Bearer ' + String(authTokens.access)
    }
  }

  const getCurrUser = async () => {
    const userResponse = await axios.get(`http://127.0.0.1:8000/api/users/${user.user_id}`);
    const userData = userResponse.data
    console.log(userData)
    setCurrUser(userData)
    const eventsResponse = await axios.get('http://127.0.0.1:8000/events/', config)
    const eventsData = eventsResponse.data
    console.log(eventsData)

    const filterOrganiseEvents = eventsData.filter(event => {
      return event.organizers.includes(user.user_id)
    })
    setOrganisedEvents(filterOrganiseEvents)
    const filterParticipateEvents = eventsData.filter(event => {
      return event.participants.includes(user.user_id)
    })
    setParticipatedEvents(filterParticipateEvents)
  };

  const organisedEventDiv = (
      <div>
        {organisedEvents.map((event, i) => (
          <div key={i}>
            <h3>Event {i + 1}</h3>
            <p>Name: {event.name}</p>
            <p>Description: {event.description}</p>
            <Button variant="primary">Edit WIP</Button>
          </div>
        ))}
      </div>
  )

  const participatedEventDiv = (
    <div>
        {participatedEvents.map((event, i) => (
          <div key={i}>
            <h3>Event {i + 1}</h3>
            <p>Name: {event.name}</p>
            <p>Description: {event.description}</p>
          </div>
        ))}
      </div>
  )

  return (
    <div>
      <p>Name: {currUser.first_name} {currUser.last_name}</p>
      <p>Email: {currUser.email}</p>
      <p> Organised Events </p>
      <hr />
      {organisedEvents && organisedEventDiv}
      <br/>
      <p> Participated Events </p>
      <hr/>
      {participatedEvents && participatedEventDiv}
    </div>
  )
}