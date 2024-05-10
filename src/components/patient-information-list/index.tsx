import { Box, Card, Flex, Text, Button, Dialog } from '@radix-ui/themes';
import PatientInformation from '../patient-information';
import { db } from '@/firebase';
import { FirebaseDocument } from '@/models/FirebaseDocuments';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Cross1Icon } from '@radix-ui/react-icons';

const PatientInformationList = () => {
    const [patients, setPatients] = useState([] as Array<FirebaseDocument>);
    const [deletePatientId, setDeletePatientId] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'patients'), orderBy('createdAt', 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let arr: Array<FirebaseDocument> = [];

            querySnapshot.forEach(doc => {
                arr.push({
                    data: doc.data(),
                    id: doc.id
                } as FirebaseDocument);
            });
            setPatients(arr);
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from snapshot listener
    }, []);

    const handleDelete = async () => {
        if (deletePatientId) {
            try {
                await deleteDoc(doc(db, 'patients', deletePatientId));
                // Remove the deleted patient from the state
                setPatients(prevPatients => prevPatients.filter(patient => patient.id !== deletePatientId));
                setDeletePatientId(null); // Reset deletePatientId after successful deletion
            } catch (error) {
                console.error('Error deleting patient:', error);
            }
        }
    };

    const handleOpenConfirmationDialog = (patientId: string) => {
        setDeletePatientId(patientId);
    };

    const handleCloseConfirmationDialog = () => {
        setDeletePatientId(null);
    };

    return (
        <Card>
            <Flex direction={'column'} justify={'center'} gap={'2'}>
                <Box display={`${patients.length === 0 ? 'block' : 'none'}`}>
                    <Text weight={'bold'}>Patient List is empty. </Text>
                </Box>
                {patients.map((value: FirebaseDocument) => (
                    <Flex key={value.id} gap="2" alignItems="center">
                        <PatientInformation {...value.data} />
                        <Button onClick={() => handleOpenConfirmationDialog(value.id)} variant="icon">
                            <Cross1Icon />
                        </Button>
                    </Flex>
                ))}
            </Flex>
            <Dialog open={!!deletePatientId} onOpenChange={handleCloseConfirmationDialog}>
                <Box>
                    <Text>Are you sure you want to delete this patient?</Text>
                    <Button onClick={handleDelete}>Yes</Button>
                    <Button onClick={handleCloseConfirmationDialog}>No</Button>
                </Box>
            </Dialog>
        </Card>
    );
};

export default PatientInformationList;
