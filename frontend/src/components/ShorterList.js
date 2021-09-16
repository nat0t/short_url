import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class ShorterList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'page': 1,
        }
        this.handlePageChange = this.handlePageChange.bind(this);
    }

    renderItems = () => {
        const itemsPerPage = this.props.itemsPerPage;
        const page = this.state.page;
        return this.props.shorterList
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map(item => (
                <TableRow key={item.id}>
                    <TableCell>{item.long_url}</TableCell>
                    <TableCell align="right">
                        <a href={item.long_url} target="_blank" rel="noreferrer noopener">
                            {this.props.backendAddress}{item.token}
                        </a>
                    </TableCell>
                </TableRow>
            ));
    }

    handlePageChange(event, value) {
        this.setState(
            {
                'page': value,
            },
            () => {
                this.renderItems();
            }
        );
    }

    render() {
        const numberOfPages = Math.ceil(this.props.shorterList.length / this.props.itemsPerPage);
        return (
            <React.Fragment>
                <TableContainer style={{ "height": (80 * this.props.itemsPerPage) }} >
                    <Table size="medium" stickyHeader >
                        <TableHead>
                            <TableRow>
                                <TableCell>Full URL</TableCell>
                                <TableCell align="right">Short URL</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.renderItems()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination variant="outlined" shape="rounded"
                    count={numberOfPages}
                    page={this.state.page}
                    onChange={this.handlePageChange} />
            </React.Fragment>
        );
    }
}


export default ShorterList;