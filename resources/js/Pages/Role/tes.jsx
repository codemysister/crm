
import React, { useState } from "react";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


export default function tes() {
    const [visible, setVisible] = useState(false);

    return (
        <>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse, autem eum numquam cumque eos reprehenderit eveniet magnam et sed nemo deserunt libero quisquam nihil odit iure? Sequi deserunt animi non accusamus quis. Similique, voluptas libero nulla consequuntur ad consectetur possimus ea quibusdam quidem omnis amet commodi corporis praesentium aliquam, animi perferendis nam earum natus vel nostrum voluptate! Temporibus amet, sit odio voluptatem quisquam accusamus nobis nulla dolores obcaecati cum totam doloremque quam numquam dolorem necessitatibus fuga. Veritatis accusantium libero totam dicta, reiciendis earum adipisci eligendi quas ex placeat excepturi quidem, blanditiis quaerat. Ratione tempore libero impedit. Quibusdam recusandae perferendis quidem.</p>
        <div className="card flex justify-content-center">
            <Button label="Show" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Header" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)}>
                <p className="m-0">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </Dialog>
        </div>
        </>
    )
}
        