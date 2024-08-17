import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { db, addDoc, firebaseCollection, storage, ref } from "./firebase";
import {recognizeObject} from './api/gemini';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const Home = () => {
  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [pantryItems, setPantryItems] = useState([]);
  const [displayOpenCam, setDisplayOpnCam] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'pantry'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPantryItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const capture = async () => {
    setDisplayOpnCam(true);
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);

    let imageUrl = '';

    try {
      const imageName = `pantry-items/${Date.now()}.jpg`;
      const storageRef = ref(storage, imageName);
      await uploadString(storageRef, image, 'data_url');
      imageUrl = await getDownloadURL(storageRef);
      console.log('Uploaded image url: ', imageUrl);
    }
    catch (error) {
      console.log('Image additon error:', error);
    }

    if (image) {
      // Save image to Firestore
      try {
        const recognizedObject = await sendToGeminiAPI(image);

        console.log('\n\nObject is: ', recognizedObject, '\n\n');
        if (recognizedObject) {
          setPantryItems([...pantryItems, {'itemName': recognizedObject.itemName, 'itemQuantity': recognizedObject.itemQuantity} ]);
        }

        try {
          // Add the item to Firebase
          await addDoc(firebaseCollection(db, 'pantry'), {
            itemName: recognizedObject.itemName,
            itemQuantity: recognizedObject.itemQuantity,
            imageURL: imageUrl
          });
        }
        catch (error) {
          console.log('item addition error: ', error);
        }
      } 
      catch (error) {
        console.error("Error encountered: ", error);
      }
    }
  };

  const sendToGeminiAPI = async (image) => {
    try {
      const response = JSON.parse(await recognizeObject({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: image,
      }));

      return response;
    } catch (error) {
      console.error("Error sending to Gemini API: ", error);
    }
  };

  const openCamera = () => {
    setDisplayOpnCam(false);
  }

  return (
    <div>
      <h1>Pantry Tracker</h1>
      {!displayOpenCam && 
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={350}
          height={300}
        /> }
      {displayOpenCam && <button onClick={openCamera}>Open Camera</button> }
      {!displayOpenCam && <button onClick={capture}>Capture Photo</button> }
      {imageSrc && <img src={imageSrc} alt="Captured" />}
      <h2>Pantry Items:</h2>
      <ul>
        {pantryItems.map((item, index) => (
          <li key={index}>{item.itemName}, {item.itemQuantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
