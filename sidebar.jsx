import React, { useState , useEffect,} from 'react';
import style from './sidebar.module.css';
import Modal from './modal';
import styled from 'styled-components'; // Import styled-components


function Sidebar({ onSelectGroup, setSelectedNoteGroup, isMobile }) {
    const [initialGroup, setInitialGroup] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [profileColor, setProfileColor] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    useEffect(() => {
        const storedGroups = JSON.parse(localStorage.getItem('createdgroups'));
        setInitialGroup(storedGroups || []);
    }, []);
    
    const handleCreateGroup = () => {
        const newGroupId = generateGroupId();
        const newGroup = {
            id: newGroupId,
            name: groupName,
            profileColor: selectedColor,
        };
    
        // Update the initialGroup array and save it to local storage
        const updatedInitialGroup = [...initialGroup, newGroup];
        localStorage.setItem('createdgroups', JSON.stringify(updatedInitialGroup));
    
        // Update state and clear form inputs
        setInitialGroup(updatedInitialGroup);
        setGroupName('');
        setProfileColor('');
        setSelectedColor('');
        setShowForm(false);
        setSelectedNoteGroup(newGroup.id);
    };
    function generateGroupId() {
        const randomString = Math.random().toString(36).substring(2, 15);
        return `group-${randomString}`;
      }
    
    const toggleForm = () => {
        setShowForm(!showForm);
    };

    const selectColor = (color) => {
        setSelectedColor(color);
    };

    const handleGroupSelection = (group) => {
        onSelectGroup(group);
        setSelectedNoteGroup(group.id);
        console.log(initialGroup);
    };

    const CenteredHeading = styled.h1`
        // text-align: ${isMobile ? 'center' : 'left'}; // Center if isMobile is true
        padding-left: ${isMobile ? '0px' : '0'}; // Apply padding-left if isMobile is true
    `;

    return (
        <div className={style.sidebar}>
            <div className={style.heading}>
                <CenteredHeading>Pocket Notes</CenteredHeading> {/* Apply styled-component */}
                </div>
                <div className={style.creategroup}>
                    <button className={style.plusbutton} onClick={toggleForm}>+</button>
                </div>
           

            <div className={style.groupsContainer}>
                <div className={style.groups}>
                    {initialGroup.map((group, index) => (
                        <div key={index} className={style.group} onClick={() => handleGroupSelection(group)} style={{ marginTop: isMobile ? '0px' : '90px' }}>
                            <div className={style.profileHeading} style={{ backgroundColor: group.profileColor }}>
                                {getProfileHeading(group.name)}
                            </div>
                            <p>{group.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showForm && (
                <Modal>
                    <div className={style.form}>
                        <div>
                        <h2 className={style.formheading}>Create New group</h2>
                        </div>
                        <label htmlFor="groupName">Group Name:</label>
                        <input
                            type="text"
                            placeholder="Enter Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <br />
                        <div className={style.profilecolor}>
                        <label>Profile Color:</label>
                        <div className={style.colorSelector}>
                            {['#FF5733', '#FFC300', '#DAF7A6', '#A0D2DB', '#C70039', '#900C3F'].map((color, index) => (
                                <div
                                    key={index}
                                    className={`${style.colorOption} ${selectedColor === color ? style.selected : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => selectColor(color)}
                                ></div>
                            ))}
                        </div>
                        </div>
                        <br />
                        <div className={style.formbutton}>
                        <button className={style.crea} onClick={handleCreateGroup}>Create</button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function getProfileHeading(groupName) {
    const initials = groupName.split(/\s+/).map(word => word.charAt(0).toUpperCase());
    return initials.join('');
}

export default Sidebar;
