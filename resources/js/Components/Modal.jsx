import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const Modal = ({ children, header, modalVisible, setModalVisible }) => {
    return (
        <div className="card flex justify-content-center">
            <Dialog
                header={header}
                headerClassName="dark:glass shadow-md dark:text-white"
                className="bg-white w-[80%] md:w-[60%] lg:w-[30%] dark:glass dark:text-white"
                contentClassName=" dark:glass dark:text-white"
                visible={modalVisible}
                onHide={() => setModalVisible(false)}
            >
                {children}
            </Dialog>
        </div>
    );
};

export default Modal;
