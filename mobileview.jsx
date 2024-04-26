import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/sidebar';
import styles from './mobileview.module.css';
import { IoMdArrowBack } from "react-icons/io";

function Mobileview() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupNotes, setGroupNotes] = useState({});
  const popupRef = useRef(null);
  const [selectedNoteGroup, setSelectedNoteGroup] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true); // State to manage sidebar visibility

  const getNotes = (groupId) => {
    return groupNotes[groupId] || [];
  };

  const handleGroupSelection = (group) => {
    setSelectedGroup(group);
    setSelectedNoteGroup(group.id);
    setSidebarVisible(false); // Hide sidebar on group selection
    const storedGroupNotes = JSON.parse(localStorage.getItem('groupNotes'));
    const selectedGroupNotes = storedGroupNotes && storedGroupNotes[group.id];
    // Set the notes in the state
    setGroupNotes(selectedGroupNotes || []);
  };

  useEffect(() => {
    const storedGroupNotes = JSON.parse(localStorage.getItem('groupNotes'));
    if (storedGroupNotes && selectedGroup) {
      const selectedGroupNotes = storedGroupNotes[selectedGroup.id];
      if (selectedGroupNotes) {
        setGroupNotes(selectedGroupNotes);
      }
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
          timestamp: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) // Adjust timestamp format
        };
        setGroupNotes(prevNotes => ({
          ...prevNotes,
          [selectedGroup.id]: [...(prevNotes[selectedGroup.id] || []), newNote]
        }));
        event.target.value = '';
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('groupNotes', JSON.stringify(groupNotes));
  }, [groupNotes]);

  // Define getProfileHeading function
  const getProfileHeading = (groupName) => {
    const initials = groupName.split(/\s+/).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
  };

  const goBack = () => {
    setSelectedGroup(null); // Reset selected group
    setSidebarVisible(true); // Show sidebar
  };

  return (
    <div>
      {sidebarVisible && (
        <Sidebar onSelectGroup={handleGroupSelection} setSelectedNoteGroup={setSelectedNoteGroup} isMobile={true} />
      )}
      {selectedGroup && (
        <div className={styles.right} ref={popupRef}>
          <div className={styles.notesContainer}>
            <div className={styles.startHeading}>
              <IoMdArrowBack onClick={goBack} />
              <p className={styles.profileHeading} style={{ backgroundColor: selectedGroup.profileColor }}>
                {getProfileHeading(selectedGroup.name)}
              </p>
              <p>{selectedGroup.name} Notes</p>
            </div>
            <div className={styles.noteBoxes} style={{ maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
              {getNotes(selectedGroup.id).map((note) => (
                <div key={note.id} className={styles.noteBox}>
                  <p className={styles.notecontent}>{note.content}</p>
                  <div className={styles.dateandtime}>{note.timestamp}<span className={styles.dot}></span></div>
                </div>
              ))}
            </div>
            <div className={styles.inputform}>
              {selectedGroup && selectedNoteGroup === selectedGroup.id && (
                <textarea
                  placeholder="Enter your note here"
                  name="notesinput"
                  className={styles.notesinputbox}
                  onKeyDown={handleAddNote}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Mobileview;
