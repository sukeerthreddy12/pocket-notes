import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/sidebar';
import styles from './desktopview.module.css';
import image from './pocketimage.png';
import { FaLock } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";

function DesktopView() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupNotes, setGroupNotes] = useState({});
  const popupRef = useRef(null);
  const [selectedNoteGroup, setSelectedNoteGroup] = useState(null);

 

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setSelectedNoteGroup(group.id);
  
    // Retrieve notes for the selected group from local storage
    const storedGroupNotes = JSON.parse(window.localStorage.getItem('groupNotes'));
  
    // Set the notes for the selected group in the state
    setGroupNotes(storedGroupNotes || {});
  };
  

const getNotes = (groupId) => {
    // Filter the notes based on the selected group's ID
    return groupNotes[groupId] ? groupNotes[groupId] : [];
  };
  

  useEffect(() => {
    const storedGroupNotes = JSON.parse(window.localStorage.getItem('groupNotes'));
    if (storedGroupNotes) {
      setGroupNotes(storedGroupNotes);
    }
  }, [selectedGroup]); 
  const handleAddNote = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const noteInput = event.target.value.trim();
      if (noteInput && selectedGroup) {
        const newNote = {
          id: Date.now(),
          content: noteInput,
          timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
        };
        // Update group notes by referencing the group ID
        setGroupNotes(prevNotes => ({
          ...prevNotes,
          [selectedGroup.id]: [...(prevNotes[selectedGroup.id] || []), newNote]
        }));
        event.target.value = '';
      }
    }
  };

  useEffect(() => {
    window.localStorage.setItem('groupNotes', JSON.stringify(groupNotes));
    console.log('store',groupNotes)
  }, [groupNotes]);


  return (
    <div className={styles.desktoppage}>
      <div className={styles.left}>
        <Sidebar onSelectGroup={handleGroupSelection} setSelectedNoteGroup={setSelectedNoteGroup} />
      </div>
      <div className={styles.right} ref={popupRef}>
        {selectedGroup ? (
          <div className={styles.notesContainer}>
            <div className={styles.startHeading}>
              <p className={styles.profileHeading} style={{ backgroundColor: selectedGroup?.profileColor || '#fff' }}>
                {getProfileHeading(selectedGroup?.name)}
              </p>
              <p>{selectedGroup?.name} Notes</p>
            </div>
            <div className={styles.noteBoxes} style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
              {getNotes(selectedGroup.id).map((note) => (
                <div key={note.id} className={styles.noteBox}>
                  <p>{note.content}</p>
                  <div className={styles.dateandtime}>{note.timestamp}<span className={styles.dot}></span></div>
                </div>
              ))}
            </div>
            <div className={styles.inputform}>
              {selectedGroup && selectedNoteGroup === selectedGroup.id && (
               <textarea
               type="text"
               placeholder="Enter your note here"
               name="notesinput"
               className={styles.notesinputbox}
               onKeyDown={handleAddNote}
               style={{ position: 'relative' }}
             >
               <IoMdSend
                 onClick={handleAddNote}
                 className={styles.sendIcon}
                 style={{
                   position: 'absolute',
                   right: '10px',
                   bottom: '10px',
                   cursor: 'pointer'
                 }}
               />
             </textarea>
             

              )}
            </div>
          </div>
        ) : (
          <div className={styles.intro}>
            <div className={styles.image}>
              <img src={image} alt="" />
            </div>
            <div className={styles.info}>
              <h2>Pocket Notes</h2>
              <p>Send and receive messages without keeping your phone online <br />
                Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
            </div>
            <div className={styles.footer}>
              <FaLock />
              <p>end-to-end</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getProfileHeading(groupName = '') {
  if (!groupName) return ''; // Return empty string if groupName is undefined or null
  const initials = groupName.split(/\s+/).map(word => word.charAt(0).toUpperCase());
  return initials.join('');
}

export default DesktopView;
