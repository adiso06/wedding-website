import { useState, ReactNode } from 'react';

interface EnvelopeIntroProps {
  children: ReactNode;
}

const EnvelopeIntro = ({ children }: EnvelopeIntroProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Handle the "Open" animation timing
  const handleOpen = () => {
    setIsOpen(true);
    // Wait for animation to finish (1.5s) before removing from DOM
    setTimeout(() => {
      setIsHidden(true);
    }, 1500);
  };

  if (isHidden) {
    return <>{children}</>;
  }

  return (
    <>
      {/* This is the "Real" website underneath.
        We render it immediately so it loads in the background.
        We apply a slight "scale" effect so it looks like it zooms in when the envelope opens.
      */}
      <div
        className={`transition-all duration-1000 ease-in-out ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 fixed inset-0 overflow-hidden'}`}
      >
        {children}
      </div>

      {/* THE ENVELOPE OVERLAY */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f0f0f0] transition-opacity duration-700 delay-700 ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {/* The Envelope Container */}
        <div
          onClick={handleOpen}
          className="relative w-[350px] h-[250px] md:w-[500px] md:h-[350px] bg-[#e0dcd3] shadow-2xl cursor-pointer group transition-transform duration-300 hover:scale-105"
        >

          {/* Bottom Flap (Pocket) */}
          <div className="absolute bottom-0 left-0 w-full h-full border-l-[175px] md:border-l-[250px] border-l-transparent border-r-[175px] md:border-r-[250px] border-r-transparent border-b-[150px] md:border-b-[200px] border-b-[#d6d0c2] z-20"></div>

          {/* Left Flap */}
          <div className="absolute top-0 left-0 w-full h-full border-t-[125px] md:border-t-[175px] border-t-transparent border-l-[175px] md:border-l-[250px] border-l-[#cdc6b5] border-b-[125px] md:border-b-[175px] border-b-transparent z-10"></div>

          {/* Right Flap */}
          <div className="absolute top-0 right-0 w-full h-full border-t-[125px] md:border-t-[175px] border-t-transparent border-r-[175px] md:border-r-[250px] border-r-[#cdc6b5] border-b-[125px] md:border-b-[175px] border-b-transparent z-10"></div>

          {/* Top Flap (The part that opens) */}
          {/* Note: 'origin-top' allows it to hinge from the top edge */}
          <div
            className={`absolute top-0 left-0 w-full h-full z-30 transition-transform duration-1000 ease-in-out origin-top border-l-[175px] md:border-l-[250px] border-l-transparent border-r-[175px] md:border-r-[250px] border-r-transparent border-t-[140px] md:border-t-[190px] border-t-[#e6e2d6] drop-shadow-md ${isOpen ? 'rotate-x-180 -z-10' : ''}`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* The Wax Seal - Centered on the tip of the top flap */}
            <div className={`absolute -top-[140px] md:-top-[190px] left-1/2 -translate-x-1/2 translate-y-[110px] md:translate-y-[150px] flex flex-col items-center transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>

              {/* Wax Seal Graphic (CSS Circle) */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-800 rounded-full border-4 border-red-900 shadow-inner flex items-center justify-center relative">
                 {/* Inner Ring */}
                 <div className="w-12 h-12 border-2 border-red-900/50 rounded-full flex items-center justify-center">
                    <span className="font-serif text-white font-bold text-xl tracking-tighter">
                      C<span className="text-xs">&</span>A
                    </span>
                 </div>
              </div>

              {/* Text Prompts */}
              <div className="mt-16 text-center w-64">
                <p className="text-gray-500 font-sans text-[10px] uppercase tracking-[0.2em] mb-1">
                  Invitation to the Union of
                </p>
                <p className="text-gray-800 font-serif italic text-sm">
                  Aditya & Chhaya
                </p>
                <p className="mt-4 text-xs font-bold text-red-800 animate-pulse">
                  [ Tap to Open ]
                </p>
              </div>

            </div>
          </div>

          {/* The "Newspaper" Inside (Preview) */}
          <div className={`absolute inset-x-4 top-4 bottom-0 bg-white shadow-lg transition-transform duration-1000 delay-300 z-0 ${isOpen ? '-translate-y-24 md:-translate-y-32' : 'translate-y-0'}`}>
            <div className="p-4 text-center opacity-50">
               <h1 className="font-serif text-3xl font-bold mt-4">The Arora-Sood Times</h1>
               <div className="h-1 bg-black w-full my-2"></div>
               <div className="grid grid-cols-3 gap-2">
                 <div className="h-20 bg-gray-200 col-span-2"></div>
                 <div className="h-20 bg-gray-200 col-span-1"></div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default EnvelopeIntro;
