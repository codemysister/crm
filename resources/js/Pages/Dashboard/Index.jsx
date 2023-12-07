import DashboardLayout from '@/Layouts/DashboardLayout';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useState } from 'react';

const Index = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <DashboardLayout>
            <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setModalVisible(true)} />
            <Dialog header="Header" visible={modalVisible} style={{ width: '50vw' }} onHide={() => setModalVisible(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
        </div>
        </DashboardLayout>
    );
}

export default Index;