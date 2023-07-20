import React, { useEffect, useState } from 'react';
import './Panel.css';

interface Snapshot {
  percySnapshot: PercySnapshot;
  screenshot: string;
}
interface PercySnapshot {
  domsnapshot: any;
  name: string;
  url: string;
}

const Panel: React.FC = () => {
  const [accessToken, setAccessToken] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState('');
  const [selectedSnapshot, setSelectedSnapshot] = useState('');
  const [newSnapshotName, setNewSnapshotName] = useState('');
  // const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [automateCapture, setAutomateCapture] = useState<Boolean>(false);

  const handleAuthentication = () => {
    // Perform authentication logic here
    setIsAuthenticated(true);
  };

  useEffect(() => {
    console.log('Devtools Panel');
  }, []);

  const handleCapture = () => {
    // Perform capture logic here
    chrome.runtime.sendMessage({ action: 'snapshot', name: newSnapshotName });
    // const newSnapshot: Snapshot = {
    //   id: snapshots.length + 1,
    //   name: newSnapshotName,
    // };
    // setSnapshots([...snapshots, newSnapshot]);
  };

  const typifySnapshots = (snapshotsObject: any) => {
    const snapshots: Snapshot[] = [];
    Object.keys(snapshotsObject).forEach((snapshotName) => {
      const percySnapshot: PercySnapshot = {
        name: snapshotsObject[snapshotName]['percyData']['name'],
        url: snapshotsObject[snapshotName]['percyData']['url'],
        domsnapshot: snapshotsObject[snapshotName]['percyData']['domsnapshot'],
      };
      const snapshot: Snapshot = {
        percySnapshot: percySnapshot,
        screenshot: snapshotsObject[snapshotName]['screenshot'],
      };
      snapshots.push(snapshot);
    });
    return snapshots;
  };

  const handleDelete = (snapshotName: string) => {
    chrome.storage.local.get('snapshots', function (result) {
      var storedSnapshots = result.snapshots;
      delete storedSnapshots[snapshotName];
      chrome.storage.local.set({ snapshots: storedSnapshots }, function () {
        console.log('Value is set in localStorage.');
        const snapshots = typifySnapshots(storedSnapshots);
        setSnapshots(snapshots);
      });
    });
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Manual Capture*/}
      <div className="w-full h-1/4 p-4">
        <div className="flex flex-row mb-4">
          <input
            type="text"
            className="w-1/2 px-2 py-1 mr-2 bg-gray-500 focus:bg-white text-white focus:text-gray-900 border border-gray-400 rounded"
            placeholder="Percy Read Access Token"
          />
          <input
            type="text"
            className="w-1/2 px-2 py-1 bg-gray-500 focus:bg-white text-white focus:text-gray-900 border border-gray-400 rounded"
            placeholder="Project Name"
          />
          <button
            className={`ml-2 px-4 py-2 rounded ${
              isAuthenticated ? 'bg-green-500' : 'bg-blue-500'
            } text-white`}
            onClick={handleAuthentication}
          >
            {isAuthenticated ? 'Authenticated' : 'Authenticate'}
          </button>
        </div>
        <div className="mb-4">
          <select className="w-full px-2 py-1 bg-gray-500 focus:bg-white text-white focus:text-gray-900 border border-gray-400 rounded">
            <option value="">Select a build</option>
            {/* Render build options dynamically */}
          </select>
        </div>
        <div className="flex flex-row">
          <select
            className="w-1/2 px-2 py-1 mr-2 bg-gray-500 focus:bg-white text-white focus:text-gray-900 border border-gray-400 rounded"
            value={selectedSnapshot}
            onChange={(e) => setSelectedSnapshot(e.target.value)}
          >
            <option value="">Select a snapshot</option>
            <option value="New Snapshot">New Snapshot</option>
            {/* Render snapshot options dynamically */}
          </select>
          <input
            type="text"
            className="w-1/2 px-2 py-1 bg-gray-500 focus:bg-white text-white focus:text-gray-900 border border-gray-400 rounded"
            placeholder="New Snapshot Name"
            disabled={selectedSnapshot !== 'New Snapshot'}
            value={newSnapshotName}
            onChange={(e) => setNewSnapshotName(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 rounded bg-blue-500 text-white"
            onClick={handleCapture}
          >
            Capture
          </button>
        </div>
      </div>
      {/* Automated capture */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-white mb-4">Automated Capture</h1>

        {/* Capture Snapshot Button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => {
            chrome.storage.local.set(
              { automate_capture: automateCapture },
              function () {
                chrome.runtime.sendMessage({
                  action: 'toggle_capture',
                  state: !automateCapture,
                });
                setAutomateCapture(!automateCapture);
              }
            );
          }}
        >
          {automateCapture === false
            ? 'Start Auto Capture'
            : 'Stop Auto Capture'}
        </button>
        {/* REFRESH SNAPSHOT LIST BUTTON*/}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => {
            chrome.storage.local.get('snapshots', function (result) {
              var storedSnapshots = result.snapshots;
              console.log(
                'Value retrieved from localStorage:',
                storedSnapshots
              );
              const snapshots = typifySnapshots(storedSnapshots);
              setSnapshots(snapshots);
            });
          }}
        >
          Refresh
        </button>
        {/* RESET SNAPSHOT LIST BUTTON*/}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          onClick={() => {
            chrome.storage.local.set({ snapshots: {} }, function () {
              console.log('Value is set in localStorage.');
            });
            setSnapshots([]);
          }}
        >
          RESET
        </button>
      </div>
      <div className="snapshot-list">
        <h2>Snapshots</h2>
        <div className="scrollable-list">
          {snapshots.map((snapshot) => (
            <div className="snapshot-item">
              <span className="snapshot-name">
                {snapshot.percySnapshot.name}
              </span>
              <button
                className="delete-button"
                onClick={() => {
                  handleDelete(snapshot.percySnapshot.name);
                }}
              >
                &#10005;
              </button>
              <img src={snapshot.screenshot} width="200" height="200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Panel;
