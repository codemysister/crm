import { router } from "@inertiajs/react";

export function handleSelectedDetailInstitution(data){
    let url = null;
    if(data.onboarding_date == undefined){
        const uuid = data.lead ? data.lead.uuid : data.uuid;
        url = `/leads?detail=${uuid}`
    }else{
        const uuid = data.partner ? data.partner.uuid : data.uuid;
        url = `/partners?detail=${uuid}`
    }
    return router.get(url);
}