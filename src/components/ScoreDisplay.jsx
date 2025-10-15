import React, { useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

function ScoreDisplay({ score, total, onRestart }) {
  const percentage = ((score / total) * 100).toFixed(1);

  useEffect(() => {
    const saveStats = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      const accuracy = (score / total) * 100;

      if (snap.exists()) {
        const d = snap.data();
        const newGames = d.gamesPlayed + 1;
        const newTotal = d.totalScore + score;
        const newBest = Math.max(d.bestScore, score);
        const newAcc = (d.accuracy * d.gamesPlayed + accuracy) / newGames;

        await updateDoc(ref, {
          gamesPlayed: newGames,
          totalScore: newTotal,
          bestScore: newBest,
          accuracy: newAcc,
        });
      } else {
        await setDoc(ref, {
          email: user.email,
          gamesPlayed: 1,
          totalScore: score,
          bestScore: score,
          accuracy: accuracy,
        });
      }
    };

    saveStats();
  }, [score, total]);

  return (
    <div className="score-display-enhanced">
      <h2 style={{ 
        fontSize: '2.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '30px'
      }}>
        Quiz terminé !
      </h2>
      
      <div style={{ 
        margin: '30px 0',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: `conic-gradient(
            #4facfe 0deg,
            #00f2fe ${percentage * 3.6}deg,
            rgba(255, 255, 255, 0.1) ${percentage * 3.6}deg,
            rgba(255, 255, 255, 0.1) 360deg
          )`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: '800',
            color: '#00d4ff'
          }}>
            {percentage}%
          </div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '20px',
        margin: '30px 0',
        padding: '20px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#00d4ff',
            marginBottom: '5px'
          }}>
            {score}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#a0a0a0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Bonnes
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#e74c3c',
            marginBottom: '5px'
          }}>
            {total - score}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#a0a0a0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Mauvaises
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: '#00d4ff',
            marginBottom: '5px'
          }}>
            {total}
          </div>
          <div style={{ 
            fontSize: '0.9rem', 
            color: '#a0a0a0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Total
          </div>
        </div>
      </div>

      <button 
        onClick={onRestart}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '16px 32px',
          color: 'white',
          fontWeight: '700',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginTop: '30px',
          minWidth: '180px'
        }}
        onMouseEnter={e => {
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        }}
      >
        Rejouer
      </button>
    </div>
  );
}

export default ScoreDisplay;
