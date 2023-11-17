import React from "react";

import "./Modal.scss";

function Modal({ name, onCancel, onConfirm }) {
  return (
    <>
      <div className="overlay" onClick={onCancel}></div>
      <dialog open className="modal">
        <article>
          <header>!! WAIT !!</header>
          <p>
            Are you sure you want to delete <span>{name}</span> ?
          </p>
          <footer>
            <a href="#cancel" role="button" onClick={onCancel}>
              Nah, Never Mind
            </a>
            <a
              href="#confirm"
              role="button"
              className="contrast"
              onClick={onConfirm}
            >
              Yes! Totally Sure
            </a>
          </footer>
        </article>
      </dialog>
    </>
  );
}

export default Modal;
