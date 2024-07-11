'use client';
import React, { useState, useEffect } from 'react';
import { toast, useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RocketIcon } from '@radix-ui/react-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { contractAddress, contractAbi } from '@/constants';
import {
  useReadContract,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { parseAbiItem } from 'viem';
import { publicClient } from '@/utils/client';
import Event from '@/components/shared/Event';

const SimpleStorage = () => {
  const { address } = useAccount();
  const [number, setNumber] = useState(null);
  const [events, setEvents] = useState([]);

  const { toast } = useToast();
  const {
    data: numberGet,
    error: errorGet,
    isPending: getIsPending,
    refetch,
  } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'retrieve',
    account: address,
  });
  const {
    data: hash,
    error,
    isPending: setIsPending,
    writeContract,
  } = useWriteContract({
    mutation: {
      // onSuccess: (data) => {
      // },
      // onError: (error) => {
      // }
    },
  });

  const setTheNumber = async () => {
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'store',
      args: [number],
    });
  };
  const {
    isLoading: isConfirming,
    isSuccess,
    error: errorConfirmation,
  } = useWaitForTransactionReceipt({ hash });

  const refetchEverything = async () => {
    await refetch();
    await getEvents();
  };

  const getEvents = async () => {
    // On récupère tous les events NumberChanged
    const numberChangedLog = await publicClient.getLogs({
      address: contractAddress,
      event: parseAbiItem('event NumberChanged(uint oldValue, uint newValue)'),
      // du premier bloc
      fromBlock: 0n,
      // jusqu'au dernier
      toBlock: 'latest', // Pas besoin valeur par défaut
    });
    // Et on met ces events dans le state "events" en formant un objet cohérent pour chaque event
    setEvents(
      numberChangedLog.map((log) => ({
        oldValue: log.args.oldValue.toString(),
        newValue: log.args.newValue.toString(),
      }))
    );
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Transaction confirmed',
        description: 'The transaction was confirmed',
        className: 'bg-lime-200',
      });
      refetchEverything();
    }
    if (errorConfirmation) {
      toast({
        title: errorConfirmation.shortMessage || errorConfirmation.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      refetchEverything();
    }
  }, [isSuccess, errorConfirmation]);

  useEffect(() => {
    const getAllEvents = async () => {
      if (address !== "undefined") {
        await getEvents();
      }
    }
    getAllEvents();
  }, [address]);

  return (
    <div className="flex flex-col w-full">
      <h2 className="mb-4 text-4xl">Get</h2>
      <div>
        {getIsPending ? (
          <p>Loading...</p>
        ) : (
          <p>
            The number in the blockchain is:{' '}
            <span className="font-bold">{numberGet.toString()} </span>
          </p>
        )}
      </div>
      <h2 className="mt-6 text-4xl">Set</h2>
      <div xl="flex flex-col w-full">
        {hash && (
          <Alert className="mb-4 bg-lime-200">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Transaction Hash: {hash}</AlertDescription>
          </Alert>
        )}
        {isConfirming && (
          <Alert className="mb-4 bg-amber-200">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Waiting for confirmation...</AlertDescription>
          </Alert>
        )}
        {isSuccess && (
          <Alert className="mb-4 bg-blue-200">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>Transaction confirmed.</AlertDescription>
          </Alert>
        )}
        {errorConfirmation && (
          <Alert className="mb-4 bg-red-2-400">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorConfirmation.shortMessage || errorConfirmation.message}{' '}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="mb-4 bg-red-400">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.shortMessage || error.message}{' '}
            </AlertDescription>
          </Alert>
        )}
      </div>
      <div className="flex">
        <Input
          placeholder="Enter a number"
          onChange={(e) => setNumber(e.target.value)}
        />
        <Button
          variant="outline"
          disabled={setIsPending}
          onClick={setTheNumber}
        >
          {setIsPending ? 'Setting' : 'Set'}
        </Button>
      </div>
      <h2 className="mt-6 text-4xl">Events</h2>
      <div className="flex flex-col w-full">
        {events?.length > 0 &&
          events.map((event) => {
            return <Event key={crypto.randomUUID()} event={event} />;
          })}
      </div>
    </div>
  );
};

export default SimpleStorage;
