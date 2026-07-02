
export function suggestedCoverPath(id){return `/assets/img/covers/${id}.jpg`}
export function suggestedAudioPath(id){return `/assets/audio/${id}.mp3`}
export function suggestedVideoPath(id){return `/assets/video/${id}.mp4`}
export function mediaStatus(hymn){return {cover:hymn.cover ? "connected" : "pending", audio:hymn.audioUrl ? "connected" : "pending", video:hymn.youtubeUrl ? "youtube" : "pending"}}
export function validateMediaLibrary(hymns){return hymns.map(h=>({id:h.id,title:h.title,cover:h.cover||suggestedCoverPath(h.id),audio:h.audioUrl||suggestedAudioPath(h.id),video:h.youtubeUrl||suggestedVideoPath(h.id),status:mediaStatus(h)}))}
export function mediaTemplate(hymn){return {id:hymn.id,title:hymn.title,cover:suggestedCoverPath(hymn.id),audio:suggestedAudioPath(hymn.id),video:suggestedVideoPath(hymn.id)}}
