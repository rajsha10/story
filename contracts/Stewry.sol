// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Stewry {
    struct Story {
        uint256 id;
        address author;
        string title;
        string content;
        uint256 tips;
    }

    mapping(uint256 => Story) public stories;
    mapping(address => mapping(uint256 => bool)) public accessGranted;
    uint256 public storyCount;

    event StoryUploaded(uint256 indexed storyId, address indexed author, string title, uint256 timestamp);
    event StoryTipped(uint256 indexed storyId, address indexed tipper, uint256 amount, uint256 newTipBalance);

    // Upload a new story to the blockchain
    function uploadStory(string memory _title, string memory _content) external {
        require(bytes(_content).length > 300, "Content must exceed 300 characters for partial view.");

        storyCount++;
        stories[storyCount] = Story(storyCount, msg.sender, _title, _content, 0);

        emit StoryUploaded(storyCount, msg.sender, _title, block.timestamp);
    }

    // View the first 300 characters of a story
    function getPreview(uint256 _storyId) external view returns (string memory) {
        Story storage story = stories[_storyId];
        require(_storyId > 0 && _storyId <= storyCount, "Story does not exist.");

        bytes memory storyContent = bytes(story.content);
        uint256 previewLength = storyContent.length > 300 ? 300 : storyContent.length;
        
        bytes memory preview = new bytes(previewLength);
        for (uint256 i = 0; i < previewLength; i++) {
            preview[i] = storyContent[i];
        }

        return string(preview);
    }

    // Tip the author to unlock the full story
    function tipAuthor(uint256 _storyId) external payable {
        require(_storyId > 0 && _storyId <= storyCount, "Story does not exist.");
        require(msg.value > 0, "Tip amount must be greater than zero.");

        Story storage story = stories[_storyId];
        story.tips += msg.value;
        
        accessGranted[msg.sender][_storyId] = true;

        // Transfer the tip to the author
        payable(story.author).transfer(msg.value);

        emit StoryTipped(_storyId, msg.sender, msg.value, story.tips);
    }

    // Retrieve the full story if access is granted
    function getFullStory(uint256 _storyId) external view returns (string memory) {
        require(accessGranted[msg.sender][_storyId], "You need to tip the author to unlock the full story.");

        return stories[_storyId].content;
    }

    // Check if a user has access to the full story
    function hasAccess(uint256 _storyId) external view returns (bool) {
        return accessGranted[msg.sender][_storyId];
    }
}
