import React from 'react';

interface MobileDrawersProps {
  activeDrawer: 'intel' | 'interrogation' | null;
  onClose: () => void;
  intelPanel: React.ReactNode;
  interrogationPanel: React.ReactNode;
}

export const MobileDrawers: React.FC<MobileDrawersProps> = ({
  activeDrawer,
  onClose,
  intelPanel,
  interrogationPanel,
}) => {
  if (!activeDrawer) return null;

  return (
    <>
      {/* Drawer Backdrop */}
      <div
        className="lg:hidden fixed inset-0 bg-black/75 backdrop-blur-sm z-40 transition-opacity animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Left Drawer: Match Intel */}
      {activeDrawer === 'intel' && (
        <aside
          className="lg:hidden fixed inset-y-0 left-0 w-[88vw] max-w-sm bg-[#131814] border-r border-[#2E3830] z-50 flex flex-col"
          role="dialog"
          aria-label="Match Intel"
        >
          {intelPanel}
        </aside>
      )}

      {/* Right Drawer: Interrogation */}
      {activeDrawer === 'interrogation' && (
        <aside
          className="lg:hidden fixed inset-y-0 right-0 w-[88vw] max-w-sm bg-[#131814] border-l border-[#2E3830] z-50 flex flex-col"
          role="dialog"
          aria-label="Interrogation"
        >
          {interrogationPanel}
        </aside>
      )}
    </>
  );
};

export default MobileDrawers;

