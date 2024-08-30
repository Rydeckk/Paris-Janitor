import { useState } from "react";

interface PopupAddPhotoProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
}

export function PopupAddPhoto({isOpen, onClose, onUpload}: PopupAddPhotoProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
        setFile(event.target.files[0]);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            onUpload(file);
            setFile(null);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <h2>Ajoutez une photo</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        className="file_input"
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                    <label className="file_name">{file ? file.name : "Pas d'image choisi"}</label>
                    <button className="upload_button" type="submit" disabled={!file}>
                        Ajouter
                    </button>
                </form>
            </div>
        </div>
    );
}