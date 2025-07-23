import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useDrumSounds } from '@/hooks/useDrumSounds';
import drumStudioBg from '@/assets/drum-studio-bg.jpg';

interface DrumButton {
  key: string;
  label: string;
  color: string;
  sound: string;
  drumType: string;
}

const drumButtons: DrumButton[] = [
  { key: 'w', label: 'W', color: 'drum-kick', sound: 'Kick', drumType: 'kick' },
  { key: 'a', label: 'A', color: 'drum-snare', sound: 'Snare', drumType: 'snare' },
  { key: 's', label: 'S', color: 'drum-hihat', sound: 'Hi-Hat', drumType: 'hihat' },
  { key: 'd', label: 'D', color: 'drum-openhat', sound: 'Open Hat', drumType: 'openhat' },
  { key: 'j', label: 'J', color: 'drum-tom', sound: 'Tom', drumType: 'tom' },
  { key: 'k', label: 'K', color: 'drum-crash', sound: 'Crash', drumType: 'crash' },
  { key: 'l', label: 'L', color: 'drum-ride', sound: 'Ride', drumType: 'ride' },
];

const DrumKit = () => {
  const [hitKeys, setHitKeys] = useState<Set<string>>(new Set());
  const { playSound } = useDrumSounds();

  const playDrum = async (drumButton: DrumButton) => {
    setHitKeys(prev => new Set(prev.add(drumButton.key)));
    
    // Play the actual drum sound
    await playSound(drumButton.drumType);
    
    toast.success(`🥁 ${drumButton.sound} played!`, {
      duration: 1000,
    });
    
    // Remove the hit animation after a short delay
    setTimeout(() => {
      setHitKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(drumButton.key);
        return newSet;
      });
    }, 200);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const drumButton = drumButtons.find(btn => btn.key === event.key.toLowerCase());
      if (drumButton) {
        playDrum(drumButton);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${drumStudioBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center space-y-12 p-8">
        {/* Title */}
        <div className="float-animation">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            🥁 Drum Kit
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Press the keys or click the drums to play
          </p>
        </div>

        {/* Drum Buttons */}
        <div className="grid grid-cols-3 md:grid-cols-7 gap-6 max-w-4xl mx-auto">
          {drumButtons.map((drum) => (
            <Button
              key={drum.key}
              onClick={() => playDrum(drum)}
              className={`
                relative w-20 h-20 md:w-24 md:h-24 text-2xl font-bold
                rounded-2xl transition-all duration-300 ease-out
                hover:scale-110 hover:rotate-3
                active:scale-95
                border-2 border-white/20
                backdrop-blur-sm
                ${hitKeys.has(drum.key) ? 'drum-hit scale-95' : 'pulse-glow'}
              `}
              style={{
                backgroundColor: `hsl(var(--${drum.color}))`,
                color: 'hsl(var(--background))',
                boxShadow: `0 8px 32px hsl(var(--${drum.color}) / 0.3)`
              }}
              variant="outline"
            >
              <span className="text-3xl font-black drop-shadow-lg">
                {drum.label}
              </span>
              <span className="absolute -bottom-8 text-xs text-foreground/70 font-medium">
                {drum.sound}
              </span>
            </Button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-muted-foreground text-lg space-y-2">
          <p>🎹 Use keyboard keys: W, A, S, D, J, K, L</p>
          <p>🖱️ Or click the drum pads above</p>
        </div>

        {/* Footer */}
        <footer className="text-center text-muted-foreground/60 text-sm">
          <p className="font-medium">Made By Parth Pvt Ltd</p>
        </footer>
      </div>
    </div>
  );
};

export default DrumKit;