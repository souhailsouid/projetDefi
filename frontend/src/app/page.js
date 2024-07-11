'use client';
import { useAccount } from 'wagmi';
import NotConnected from '@/components/shared/NotConnected';
import HomeDashboard from '@/components/shared/HomeDashboard';
export default function Home() {
  const { isConnected } = useAccount();
  return <>{isConnected ? <HomeDashboard /> : <NotConnected />}</>;
}
