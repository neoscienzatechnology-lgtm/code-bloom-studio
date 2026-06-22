import { useState } from "react";
import { PlayCircle } from "lucide-react";
import { theoryVideoUrl } from "@/config/theoryVideos";

/**
 * Card "Teoria em vídeo": um resumo animado (Remotion) da lição, mostrado antes
 * dos cartões de teoria. Não bloqueia o avanço; se o vídeo não carregar, some
 * silenciosamente com uma nota discreta.
 */
const TheoryVideoCard = ({ courseId, lessonId }: { courseId: string; lessonId: string }) => {
  const url = theoryVideoUrl(courseId, lessonId);
  const [failed, setFailed] = useState(false);

  return (
    <div className="ct-surface rounded-2xl p-5">
      <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black text-primary">
        <PlayCircle size={13} /> Teoria em vídeo
      </div>
      {!url || failed ? (
        <p className="text-sm text-muted-foreground">Vídeo desta aula em breve.</p>
      ) : (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          onError={() => setFailed(true)}
          className="aspect-video w-full rounded-xl border border-border bg-black"
        />
      )}
      <p className="mt-3 text-sm text-muted-foreground">
        Um resumo rápido e visual da ideia antes de você praticar.
      </p>
    </div>
  );
};

export default TheoryVideoCard;
