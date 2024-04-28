'use client'

import React, { useEffect, useState } from 'react'
import * as Form from '@radix-ui/react-form';
import { Button, Card, Flex, RadioGroup, TextField, Theme, Text } from '@radix-ui/themes';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase'
// Old patient: name, contact no. 
// New patient: name, age, sex, address, contact no. and complain
import * as AlertDialog from '@radix-ui/react-alert-dialog';


const OldPatientForm = () => {

    const [openDialog, setOpenDialog] = useState(false)


    const submitForm = async (e: any) => {
        const data = Object.fromEntries(new FormData(e.currentTarget))

        e.preventDefault()
        // alert('asdas')
        await addDoc(
            collection(db, 'items'),
            data
        )
    }

    return (
        <>
            <AlertDialog.Root open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialog.Portal>
                    <Theme>
                        <AlertDialog.Overlay className='AlertDialogOverlay' />
                        <AlertDialog.Content className='fixed top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%]'>
                            <Card>
                                <Flex direction={'column'} gap={'5'}>
                                    <AlertDialog.Description asChild>
                                        <Text>Form succesfully submitted. </Text>
                                    </AlertDialog.Description>
                                    <AlertDialog.Cancel asChild className=' ml-auto'>
                                        <Button>Close</Button>
                                    </AlertDialog.Cancel>
                                </Flex>
                            </Card>
                        </AlertDialog.Content>
                    </Theme>
                </AlertDialog.Portal>
            </AlertDialog.Root>
            <Card>
                <Form.Root onSubmit={submitForm}>
                    <Form.Field className="FormField" name="name">
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <Form.Label className="FormLabel">Name</Form.Label>
                            <Form.Message className="FormMessage" match="valueMissing" asChild>
                                <Text>Please enter your Name</Text>
                            </Form.Message>
                            <Form.Message className="FormMessage" match="typeMismatch" asChild>
                                <Text>Please provide a valid Name</Text>
                            </Form.Message>
                        </div>
                        <Form.Control asChild>
                            <TextField.Root required />
                        </Form.Control>
                    </Form.Field>

                    <Form.Field className={`FormField`} name="contact-no.">
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                            <Form.Label className="FormLabel">Contact No.</Form.Label>
                            <Form.Message className="FormMessage" match="valueMissing">
                                <Text>Please enter your contact no.</Text>
                            </Form.Message>
                            <Form.Message className="FormMessage" match={
                                (value, formData): boolean => {
                                    const regex = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
                                    return value.match(regex) ? false : true
                                }
                            }>
                                <Text>Please provide a valid contact no.</Text>
                            </Form.Message>
                        </div>
                        <Form.Control asChild>
                            <TextField.Root type='number' required />
                        </Form.Control>
                    </Form.Field>

                    {/* <Form.Field className="FormField" name="complaints">
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <Form.Label className="FormLabel">Complaints</Form.Label>
                    </div>
                    <Form.Control asChild>
                    <TextArea placeholder='Type a complaint.' />
                    </Form.Control>
                </Form.Field> */}
                    <Form.Submit asChild>
                        <Button>
                            Submit
                        </Button>
                    </Form.Submit>

                </Form.Root>
            </Card>
        </>
    )
}

export default OldPatientForm