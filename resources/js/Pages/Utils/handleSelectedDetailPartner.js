import { router } from "@inertiajs/react";

export function handleSelectedDetailPartner(partner){
    router.get(`/partners?uuid=${partner.uuid}`);
};
