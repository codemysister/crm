import { router } from "@inertiajs/react";

export function handleSelectedDetailInstitution(data){
    let leadOrPartner = data.partner == null
    ? data.lead
    : data.partner
    let url = ''
    if(leadOrPartner.live_date == undefined){
        url = `/leads?detail=${leadOrPartner.uuid}`
    }else{
        url = `/partners?detail=${partner.uuid}`
    }
    return router.get(url);
}