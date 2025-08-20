'use client';
import React from 'react'
import { useRouter } from 'next/navigation';

const Mission = () => {

const router = useRouter();
    
const mission = 'PDF';
    switch (mission) {
        case 'PDF':
            return router.push("/update/pdf");
        default:
            break;
    }
}

export default Mission