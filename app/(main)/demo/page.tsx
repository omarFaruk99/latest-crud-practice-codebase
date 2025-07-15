'use client'
import React, {useRef} from 'react';
import ActionTemplate from "@/components/ActionTemplate";
import {ConfirmPopup} from "primereact/confirmpopup";
import Label from "@/components/Label";
import PageHeading from "@/components/PageHeading";

const Page = () => {
    const deletref = useRef(null);
    return (
        <div className={'card'}>
            <ConfirmPopup/>
            <ActionTemplate id={3} deleteRef={deletref} accept={() => console.log('delete yes.')}
                            editFunction={() => console.log('click edit')} download={true}
                            exportFunction={() => console.log("download pdff")}/>
            <Label label={'title'} required={true}/>
            <PageHeading title={"page title"} back={true} backFunction={() => console.log('click back')}
                         isCreate={true} createFunction={() => console.log("click create.")}/>
        </div>
    );
};

export default Page;
