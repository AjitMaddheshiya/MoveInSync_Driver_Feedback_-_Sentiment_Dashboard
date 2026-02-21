import { useApp } from '../context/AppContext';
import DriverLeaderboard from '../components/dashboard/DriverLeaderboard';
import DriverDetailModal from '../components/dashboard/DriverDetailModal';
import './DriversPage.css';

export default function DriversPage() {
  const { state, selectDriver } = useApp();

  return (
    <div className="drivers-page">
      <div className="page-header">
        <h1 className="page-title">Drivers</h1>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Driver Leaderboard</h3>
        </div>
        <DriverLeaderboard />
      </div>

      {/* Driver Detail Modal */}
      {state.selectedDriver && (
        <DriverDetailModal 
          driver={state.selectedDriver}
          onClose={() => selectDriver(null)}
        />
      )}
    </div>
  );
}
