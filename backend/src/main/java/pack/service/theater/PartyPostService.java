package pack.service.theater;

import pack.dto.theater.PartyResponse;
import pack.dto.theater.PartyPostRequest;

import java.util.List;
import java.util.Map;

public interface PartyPostService {
	PartyResponse getPartyPostByNo(Integer partyPostNo);
    List<PartyResponse> getFilteredPartyPosts(List<Integer> theaterIds, String start, String end);
    void createPartyPost(PartyPostRequest dto);
    Map<Integer, Long> countPartyPostsByTheater();
    
    PartyResponse updatePartyPost(Integer partyPostNo, PartyPostRequest dto);
    void deletePartyPost(Integer partyPostNo);
}
