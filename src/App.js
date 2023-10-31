import { useEffect, useState } from 'react';
import { MapContainer, useMap, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import L from 'leaflet';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [rating, setRating] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');



  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/api/pins');
        setPins(res.data)
        // console.log("all pins=>",res.data);

      } catch (error) {
        console.log(error)
      }
    }
    getPins();
  }, [])

  const position = [48.858093, 2.294694];
  const zoom = 4;

  const handleClick = (id) => {
    console.log(id, "clicked id")
    setCurrentPlaceId(id)
  }


  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.lng
    }
    try {
      const res = await axios.post('/api/pins', newPin);
      setPins([...pins, res.data]);
      setNewPlace(null)
      setTitle('');
      setDesc('')
      setRating(0)

    } catch (error) {
      console.log(error, "err")
    }
  }


  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${newPlace?.lat}&lon=${newPlace?.lng}`)
      .then(response => response.json())
      .then(data => {
        console.log(data, 'country')
        if (data.address && data.address.country) {
          setCountryName(data.address.country);
          setState(data.address.state);
          setDistrict(data.address.state_district);


        }
      })
      .catch(error => {
        console.error('Error fetching country name:', error);
      });

  }, [newPlace])
  const MyComponent = () => {
    const map = useMap();

    map.on('dblclick', function (e) {
    //  console.log(e.latlng, "lan")
      const { lng, lat } = e.latlng;
      setNewPlace({
        lat,
        lng
      })
    });
    return null;
  };

  return (
    <div className="App">
      <MapContainer center={position} zoom={zoom}
        style={{ height: '100vh', width: '100vw' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

<MyComponent />

        {
          pins?.map((p, index) => {
            return (
              <div key={index}>
                <Marker position={[p.lat, p.long]}
                  icon={new L.Icon({
                    iconUrl: currentUser === p.username ? 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                      : require('leaflet/dist/images/marker-icon.png'),
                    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
                    iconSize: [25, 41],
                    iconAnchor: [12, 41], // Default anchor point for the marker icon
                    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
                    shadowSize: [41, 41],
                  })

                  }

                  eventHandlers={{ click: () => handleClick(p._id) }}>
                  {/* <FontAwesomeIcon icon={faMapMarkerAlt}
                  style={{ color: 'red' }}
                  /> */}
                </Marker>
                {currentPlaceId === p._id &&
                  <Popup
                    position={[p.lat, p.long]}
                    onClose={() => setCurrentPlaceId(null)}
                  >
                    <div className='card'>
                      <label>Place</label>
                      <h3>{p.title}</h3>
                      <label>Review</label>
                      <p className='desc'>{p.desc}</p>
                      <label>Rating</label>
                      <div>
                        {
                          Array(p.rating).fill(<FontAwesomeIcon className='star' icon={faStar} />
                          )
                        }
                      </div>
                      <br></br>
                      <label>Information</label>
                      <span className='username'>Created by <b>{p.username}</b></span>
                      <span className='cate'>{format(p.createdAt)}</span>

                    </div>
                  </Popup>}
              </div>
            )
          })
        }

        {newPlace && <Popup
          position={[newPlace.lat, newPlace.lng]}
          onClose={() => setCurrentPlaceId(null)}
        >
          <div className=''>
            {currentUser &&
              <>
                <p className='head'>
                  <span className='userText'>
                    {currentUser && currentUser.toUpperCase()}
                    {" "} </span>
                  you just creating new pin at:</p>
                <div className='locations'>
                  {countryName && <div className='country'>
                    <label>Country: </label>
                    <p>{countryName}</p>
                  </div>}
                  {state && <div className='state'>
                    <label>State: </label>
                    <p>{state}</p>
                  </div>}
                  {district && <div className='district'>
                    <label>District: </label>
                    <p>{district}</p>
                  </div>}
                </div>

              </>
            }
            <form onSubmit={handleSubmit} >
              <label>Title: </label>

              <input   autofocus="autofocus"
 className='tit' value={title} placeholder='Enter a Title'
                onChange={(e) => setTitle(e.target.value)} />
              <label>Review: </label>
              <textarea placeholder='Enter description'
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <label>Rating: </label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>

              </select>
              <button type="submit" className='submitBtn'>Add Pins </button>

            </form>


          </div>
        </Popup>}

        {
          currentUser ? (<button className='btnLogout'
            onClick={handleLogout}
          >Log out</button>)
            : (
              <div className='buttons'>
                <button className='btnLogin'
                  onClick={() => setShowLogin(true)}>Login</button>
                <button className='btnRegister'
                  onClick={() => setShowRegister(true)}
                >Register</button>
              </div>
            )
        }

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}

      </MapContainer>
    </div>
  );
}

export default App;
