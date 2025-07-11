package pack.service.board;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pack.model.board.Post;
import pack.model.board.PostLike;
import pack.repository.board.PostLikeRepository;
import pack.repository.board.PostRepository;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;


@Service
@RequiredArgsConstructor
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public boolean likePost(String memberId, Integer postNo) {
        if (memberId == null || memberId.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "회원 ID는 필수입니다.");
        }

        Post post = postRepository.findById(postNo)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "해당 게시글을 찾을 수 없습니다."));

        boolean alreadyLiked = postLikeRepository.existsByMemberIdAndPostNo(memberId, postNo);
        if (alreadyLiked) {
            postLikeRepository.deleteByMemberIdAndPostNo(memberId, postNo);
            post.decreaseLikes();
        } else {
            postLikeRepository.save(PostLike.builder()
                    .memberId(memberId)
                    .postNo(postNo)
                    .build());
            post.increaseLikes();
        }

        postRepository.save(post);
        return !alreadyLiked;
    }

    @Override
    public boolean isPostLiked(String memberId, Integer postNo) {
        if (memberId == null || memberId.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "회원 ID는 필수입니다.");
        }
        return postLikeRepository.existsByMemberIdAndPostNo(memberId, postNo);
    }
}