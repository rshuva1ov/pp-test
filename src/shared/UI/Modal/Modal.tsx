import React from 'react';
import classes from './modal.css'

interface ModalInterface {
    children: any,
    visible: boolean,
    setVisible: (arg0: boolean) => void
}

export const Modal = ({ children, visible, setVisible }: ModalInterface) => {

    const rootClasses = [classes.modal]
    if (visible) {
        rootClasses.push(classes.active)
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={classes.modal__content} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
            <button onClick={() => setVisible(false)}>X</button>
        </div>
    );
};