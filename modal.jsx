
import React from 'react';
import style from './modal.module.css';

const Modal = ({ children }) => {
    return (
        <div className={style.modalOverlay}>
            <div className={style.modalContent}>{children}</div>
        </div>
    );
};

export default Modal;
